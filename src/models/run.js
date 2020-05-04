module.exports = (sequelize, DataTypes) => {
  const Run = sequelize.define('run', {
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    startFuelLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Start fuel level cannot be a negative number or 0.'
        },
        isInt: {
          msg: 'Start fuel level must be an integer.'
        }
      }
    },
    startMileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Start mileage cannot be a negative number or 0.'
        },
        isInt: {
          msg: 'Start mileage must be an integer.'
        }
      }
    }
  })

  Run.associate = (models) => {
    Run.belongsTo(models.driver)
  }

  return Run
}
