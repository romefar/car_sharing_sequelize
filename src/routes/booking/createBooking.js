const { booking } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const createBooking = async (req, res) => {
  let data = ''

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const { carId, driverId } = JSON.parse(data)
      const bookingItem = await booking.create({ carId }, { driverId })
      responseUtil(res, 201, bookingItem)
    } catch (error) {
      const msg = error.errors ? error.errors[0].message : error.message
      responseUtil(res, 400, msg, true)
    }
  })
  req.on('error', (error) => {
    responseUtil(res, 500, error.message, true)
  })
}

module.exports = createBooking
