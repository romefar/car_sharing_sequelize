module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define('creditCard', {
    cardNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isCreditCard: true
      }
    },
    cardHolder: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    cardValidDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  })
  return CreditCard
}
