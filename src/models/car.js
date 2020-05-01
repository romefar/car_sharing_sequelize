module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('car', {
    vin: {
      type: DataTypes.STRING(17),
      unique: true,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          msg: 'Each character in the VIN must be either a letter from the alphabet or a number from 0 through 9.'
        },
        isVin (value) {
          if (value.length !== 17 || !value.match(/[A-HJ-NPR-Z0-9]{13}[0-9]{4}/g)) {
            throw new Error('Invalid VIN.')
          }
        }
      }
    },
    registrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [5, 9],
          msg: 'Invalid EU vehicle registration number. The number length must be between 5 and 9'
        },
        is: {
          args: [/^[A-Z0-9-]+$/g],
          msg: 'The registration number can only contain letters, numbers and hyphen characters.'
        }
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Empty brand name is not allowed.'
        },
        is: {
          args: [/^[a-zA-Z-]+$/g],
          msg: 'The brand name can only contain letters and hyphen characters.'
        }
      }
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Empty model name is not allowed.'
        },
        isAlphanumeric: {
          msg: 'The model name can only contain letters and numbers characters.'
        }
      }
    },
    productionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfter: {
          args: ['2010-01-01'], // YYYY-MM-DD ISO 8601
          msg: 'The car cannot be older than 10 years.'
        },
        isBefore: {
          args: [new Date().toJSON().slice(0, 10)],
          msg: 'The car cannot be produced today.'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('Free', 'In use', 'Unavailable', 'In service', 'Reserved'),
      defaultValue: 'Free'
    },
    fuelCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Fuel capacity cannot be a negative number.'
        },
        isInt: {
          msg: 'Fuel capacity must be an integer.'
        }
      }
    },
    fuelLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Fuel level cannot be a negative number.'
        },
        isInt: {
          msg: 'Fuel level must be an integer.'
        }
      }
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Mileage cannot be a negative number.'
        },
        isInt: {
          msg: 'Mileage must be an integer.'
        }
      }
    },
    geoLatitude: {
      type: DataTypes.FLOAT(8, 5),
      allowNull: false,
      validate: {
        is: {
          args: [/^(-?\d{1,3}(\.?\d{5})?)$/g],
          msg: 'Invalid latitude value. Max latitude accuracy is 5.'
        }
      }
    },
    geoLongtitude: {
      type: DataTypes.FLOAT(8, 5),
      allowNull: false,
      validate: {
        is: {
          args: [/^(-?\d{1,3}(\.?\d{5})?)$/g],
          msg: 'Invalid longtitude value. Max longtitude accuracy is 5.'
        }
      }
    },
    useCounter: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Use counter cannot be a negative number.'
        },
        isInt: {
          msg: 'Use couter must be an integer.'
        }
      }
    }
  }, {
    validate: {
      checkFuelLevel () {
        if (this.fuelLevel > this.fuelCapacity) {
          throw new Error('Fuel level cannot be more than the fuel capacity.')
        }
      }
    }
  })
  return Car
}
