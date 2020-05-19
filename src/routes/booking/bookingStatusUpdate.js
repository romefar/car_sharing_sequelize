const { booking } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')
const { BOOKING_CLOSED } = require('../../utils/bookingsStatus')

const bookingStatusUpdate = async (req, res) => {
  let data = ''

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const { status, bookingId, finishFuelLevel, finishMileage } = JSON.parse(data)
      const bookingItem = await booking.findByPk(bookingId)
      if (bookingItem !== null) {
        bookingItem.status = status
        if (finishFuelLevel && finishMileage && status === BOOKING_CLOSED) {
          bookingItem.finishFuelLevel = finishFuelLevel
          bookingItem.finishMileage = finishMileage
        }
        await bookingItem.save()
        responseUtil(res, 200, bookingItem)
      } else {
        responseUtil(res, 404, 'Booking not found.', true)
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

module.exports = bookingStatusUpdate
