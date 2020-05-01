const { car } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const carsRemove = async (req, res) => {
  let data = ''

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const { vin } = JSON.parse(data)
      const carItem = await car.findOne({ where: { vin } })
      const removedCar = await car.destroy({ where: { vin } })
      if (carItem !== null && removedCar !== 0) {
        responseUtil(res, 200, carItem)
      } else {
        responseUtil(res, 404, [], true)
      }
    } catch (error) {
      const msg = error.errors ? error.errors[0].message : error.message
      responseUtil(res, 400, msg, true)
    }
  })
  req.on('error', (error) => {
    responseUtil(res, 500, error.message, true)
  })
}
module.exports = carsRemove
