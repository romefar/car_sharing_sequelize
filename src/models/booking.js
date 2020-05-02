const { Op } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    status: {
      type: DataTypes.ENUM('Booked', 'Active', 'Closed', 'Cancelled'),
      defaultValue: 'Booked',
      validate: {
        [Op.in]: {
          args: ['Booked', 'Active', 'Closed', 'Cancelled'],
          msg: 'Invalid booking status.'
        }
      }
    },
    finishFuelLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    finishMileage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    hooks: {
      async beforeCreate (instance, { driverId }) {
        const {
          dataValues: { carId },
          sequelize: { models: { car: carModel, run: runModel, driver: driverModel, creditCard } }
        } = instance

        const driverCardData = await driverModel.findOne({
          where: {
            id: driverId
          },
          attributes: [],
          include: {
            model: creditCard,
            attributes: ['cardValidDate', 'isAuthorized']
          }
        })
        if (driverCardData === null) throw new Error('A driver wasn\'t found.')
        const driverHasCar = await runModel.findOne({
          where: {
            driverId
          }
        })
        if (driverHasCar !== null) throw new Error('A driver has a car in use.')
        const { creditCard: { cardValidDate } } = JSON.parse(JSON.stringify(driverCardData))

        if (cardValidDate <= new Date().toJSON().slice(0, 10)) throw new Error('Cannot book a car with an expired card.')

        const car = await carModel.findByPk(carId)
        if (car === null) throw new Error('Car wasn\'t found.')

        let msg
        switch (car.status) {
          case 'Unavailable':
          case 'In service':
            msg = 'The car is unavailable now.'
            break
          case 'Reserved':
            msg = 'The car is already reserved.'
            break
          case 'In use':
            msg = 'The car is already in use.'
            break
          case 'Free':
            msg = null
            break
          default:
            msg = 'Cannot recognize the car status.'
            break
        }

        if (msg !== null) throw new Error(msg)

        car.status = 'Reserved'
        await car.save()

        const run = await runModel.create({
          startFuelLevel: car.fuelLevel,
          startMileage: car.mileage,
          driverId
        })
        instance.runId = run.id
        await run.save()
      },

      // we will recieve clientId and carId from the client
      async beforeUpdate (instance) {
        const {
          dataValues: { finishFuelLevel, finishMileage, carId, status },
          sequelize: { models: { car: carModel, run: runModel } }
        } = instance
        const availableStatus = ['Booked', 'Active', 'Closed', 'Cancelled']
        if (!availableStatus.includes(status)) throw new Error('Invalid booking status.')

        const car = await carModel.findByPk(carId)

        if (status === 'Active') {
          const editStatus = await checkStatus(runModel, instance.runId)
          if (editStatus) throw new Error('Cannot change status of a closed / canceled booking.')
          const run = await runModel.findByPk(instance.runId)
          run.startDate = sequelize.fn('NOW')
          await run.save()

          car.status = 'In use'
          await car.save()
        }

        if (status === 'Closed') {
          const { dataValues: { runId } } = instance
          const { fuelCapacity, mileage } = car
          const editStatus = await checkStatus(runModel, runId)
          if (editStatus) throw new Error('Cannot change status of a closed / canceled booking.')

          if (finishFuelLevel === 0 || finishMileage === 0) {
            throw new Error('Finish fuel level or finish mileage cannot be equal 0')
          }
          // Finish fuel level is not checked because is can be refueled
          if (finishFuelLevel > fuelCapacity || finishMileage <= mileage) {
            throw new Error(`Invalid resources data. Tank capacity is ${fuelCapacity} litres but spent ${finishFuelLevel}. Car mileage is ${mileage} but finishMileage is ${finishMileage}.`)
          }

          const run = await runModel.findByPk(runId)
          run.endDate = sequelize.fn('NOW')
          await run.save()

          await car.increment('useCounter', { by: 1 })
          car.status = 'Free'
          car.mileage = finishMileage
          car.fuelLevel = finishFuelLevel
          // TODO: Remove random geo coordinates for prod version
          car.geoLongtitude = (Math.random() * 360 - 180).toFixed(5)
          car.geoLatitude = (Math.random() * 180 - 90).toFixed(5)
          await car.save()
        }

        if (status === 'Cancelled') {
          const editStatus = await checkStatus(runModel, instance.runId)
          if (editStatus) throw new Error('Cannot change status of a closed / canceled booking.')
          await car.increment('useCounter', { by: 1 })
          car.status = 'Free'
          await car.save()
        }
      }
    }
  })

  Booking.associate = (models) => {
    Booking.belongsTo(models.car)
    Booking.belongsTo(models.run)
  }

  return Booking
}

const checkStatus = async (model, id) => {
  const checkRun = await model.findOne({ where: { id }, attributes: ['endDate'] })
  const { endDate } = JSON.parse(JSON.stringify(checkRun))
  console.log(!!endDate)
  return endDate
}
