module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('driver', {
    licenseNumber: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: {
          args: [/^[0-9A-Z-]+$/],
          msg: 'The driver license can only contain letters, numbers and hyphen characters.'
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Empty first name is not allowed.'
        },
        is: {
          args: [/^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/],
          msg: 'First name can only contain the following characters: a-z, A-Z, \', hyphen and space.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Empty last name is not allowed.'
        },
        is: {
          args: [/^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/],
          msg: 'Last name can only contain the following characters: a-z, A-Z, \', hyphen and space.'
        }
      }
    }
  })

  Driver.associate = (models) => {
    Driver.belongsTo(models.creditCard)
  }

  return Driver
}
