const { driver, creditCard } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const driversList = async (res) => {
  try {
    const data = await driver.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'creditCardId'] },
      include: {
        model: creditCard,
        attributes: ['isAuthorized', 'cardValidDate']
      }
    })

    if (data.length !== 0) {
      const driverData = JSON.parse(JSON.stringify(data))
      responseUtil(res, 200, driverData)
    } else {
      responseUtil(res, 200, [])
    }
  } catch (error) {
    responseUtil(res, 500, error.message, true)
  }
}

module.exports = driversList
