module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    finishFuelLevel: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    finishMileage: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    }
  }, {
    hooks: {
      async afterCreate (instance) {
        const { dataValues: { carId }, sequelize: { models: { car: carModel } } } = instance
        const car = await carModel.findByPk(carId)
        car.status = 'Reserved'
        await car.save()

        // TODO: change run start fuel and mileage data
      },
      async beforeUpdate (instance) {
        const {
          dataValues: { finishFuelLevel, finishMileage, carId, runId },
          sequelize: { models: { car: carModel, run: runModel } }
        } = instance

        if (finishFuelLevel !== 0 && finishMileage !== 0) {
          const car = await carModel.findByPk(carId)
          const { fuelCapacity, mileage } = car
          if (finishFuelLevel > fuelCapacity || finishMileage < mileage) {
            throw new Error(`Invalid resources data. Tank capacity is ${fuelCapacity} litres but spent ${finishFuelLevel}. Car mileage is ${mileage} but finishMileage is ${finishMileage}.`)
          }

          await car.increment('useCounter', { by: 1 })
          car.status = 'Free'
          car.mileage = finishMileage
          car.fuelLevel = finishFuelLevel
          // TODO: change long/lat data
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
