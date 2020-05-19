const { booking, car, run, driver } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const bookingList = async (res) => {
  try {
    const bookings = await booking.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{
        model: car,
        attributes: ['brand', 'model', 'vin']
      },
      {
        model: run,
        attributes: ['startDate', 'endDate'],
        include: {
          model: driver,
          attributes: ['firstName', 'lastName', 'licenseNumber']
        }
      }]
    })

    if (bookings.length > 0) {
      const bookingData = JSON.parse(JSON.stringify(bookings))
      responseUtil(res, 200, bookingData)
    } else {
      responseUtil(res, 200, [])
    }
  } catch (error) {
    responseUtil(res, 500, error.message, true)
  }
}

module.exports = bookingList
