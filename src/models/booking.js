module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    status: {
      type: DataTypes.ENUM('Booked', 'Active', 'Closed', 'Cancelled'),
      defaultValue: 'Booked'
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
          sequelize: { models: { car: carModel, run: runModel } }
        } = instance

        const car = await carModel.findByPk(carId)

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

        const car = await carModel.findByPk(carId)

        if (status === 'Active') {
          const run = await runModel.update({
            startDate: DataTypes.NOW
          })
          await run.save()

          car.status = 'In use'
          await car.save()
        }

        if (status === 'Closed') {
          const { dataValues: { runId } } = instance
          const { fuelCapacity, mileage } = car

          if (finishFuelLevel === 0 || finishMileage === 0) {
            throw new Error('Finish fuel level or finish mileage cannot be equal 0')
          }
          // Finish fuel level is not checked because is can be refueled
          if (finishFuelLevel > fuelCapacity || finishMileage <= mileage) {
            throw new Error(`Invalid resources data. Tank capacity is ${fuelCapacity} litres but spent ${finishFuelLevel}. Car mileage is ${mileage} but finishMileage is ${finishMileage}.`)
          }

          const run = await runModel.findByPk(runId)
          run.endDate = DataTypes.NOW
          await run.save()

          await car.increment('useCounter', { by: 1 })
          car.status = 'Free'
          car.mileage = finishMileage
          car.fuelLevel = finishFuelLevel
          // TODO: Remove random geo coordinates for prod version
          car.geoLongtitude = (Math.random() * 360 - 180).toFixed(7)
          car.geoLatitude = (Math.random() * 180 - 90).toFixed(7)
          await car.save()
        }

        if (status === 'Cancelled') {
          await car.increment('useCounter', { by: 1 })
          car.status = 'Free'
          await car.save()
        }

        if (status === 'Closed' || status === 'Cancelled') {
          throw new Error('Cannot chanhe closed bookings.')
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
