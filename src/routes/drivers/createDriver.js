const { driver, creditCard } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const createDriver = async (req, res) => {
  let data = ''

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const { driver: driverData, driverCreditCard } = JSON.parse(data)
      const card = await creditCard.create(driverCreditCard)
      const creditCardId = card.id
      const newDriver = await driver.create({ ...driverData, creditCardId })
      responseUtil(res, 201, newDriver)
    } catch (error) {
      const msg = error.errors ? error.errors[0].message : error.message
      responseUtil(res, 400, msg, true)
    }
  })
  req.on('error', (error) => {
    responseUtil(res, 500, error.message, true)
  })
}

module.exports = createDriver
