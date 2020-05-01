const { car } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const createCar = async (req, res) => {
  let data = ''

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const carData = JSON.parse(data)
      const newCar = await car.create(carData)
      responseUtil(res, 201, newCar)
    } catch (error) {
      const msg = error.errors ? error.errors[0].message : error.message
      responseUtil(res, 400, msg, true)
    }
  })
  req.on('error', (error) => {
    responseUtil(res, 500, error.message, true)
  })
}

module.exports = createCar
