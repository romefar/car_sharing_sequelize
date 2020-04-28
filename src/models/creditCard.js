module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define('creditCard', {
    cardNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isCreditCard: {
          msg: 'Invalid card number.'
        }
      }
    },
    cardHolder: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Empty card holder name is not allowed.'
        },
        is: {
          args: [/^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/g],
          msg: 'Card holder name can only contain the following characters: a-z, A-Z, \', hyphen and space.'
        }
      }
    },
    cardValidDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfter: {
          args: [new Date().toJSON().slice(0, 10)],
          msg: 'You cannot use an expired credit card.'
        }
      }
    },
    isAuthorized: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
  })
  return CreditCard
}
