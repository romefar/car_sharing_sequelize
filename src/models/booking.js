module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    finishFuelLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    finishMileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  })

  Booking.associate = (models) => {
    Booking.belongsTo(models.car)
    Booking.belongsTo(models.run)
  }

  return Booking
}
