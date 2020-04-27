module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('car', {
    vin: {
      type: DataTypes.STRING(17),
      unique: true,
      allowNull: false,
      validate: {
        isAlphanumeric: true,
        isVin (value) {
          if (value.length !== 17) {
            throw new Error('Incorrect VIN length.')
          } else {
            if (!value.matches(/[A-HJ-NPR-Z0-9]{13}[0-9]{4}/)) {
              throw new Error('Incorrect VIN value.')
            }
          }
        }
      }
    },
    registrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isAlphanumeric: true
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    productionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Free', 'In use', 'Unavailable', 'In service'),
      defaultValue: 'Free'
    },
    fuelCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      validate: {
        min: 0
      }
    },
    fuelLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    geoLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    geoLongtitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  })
  return Car
}
