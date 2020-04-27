module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('driver', {
    licenseNumber: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  })

  Driver.associate = (models) => {
    Driver.belongsTo(models.creditCard)
  }

  return Driver
}
