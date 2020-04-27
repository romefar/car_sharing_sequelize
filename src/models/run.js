module.exports = (sequelize, DataTypes) => {
  const Run = sequelize.define('run', {
    startDate: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    startFuelLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    startMileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  })

  Run.associate = (models) => {
    Run.belongsTo(models.driver)
  }

  return Run
}
