const { car, creditCard, driver, run, booking } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const cardReservedList = async (res) => {
  try {
    const data = await booking.findAll({
      where: {
        status: 'Booked'
      },
      attributes: [],
      include: [{
        model: car,
        attributes: ['vin', 'geoLatitude', 'geoLongtitude']
      },
      {
        model: run,
        attributes: ['driverId'],
        include: {
          model: driver,
          attributes: ['firstName', 'lastName', 'licenseNumber'],
          include: {
            model: creditCard,
            attributes: [],
            where: {
              isAuthorized: false
            }
          }
        }
      }]
    })

    if (data.length !== 0) {
      const jsonTmp = JSON.parse(JSON.stringify(data))
      const carDriverData = jsonTmp.map(item => {
        const { car, run: { driver } } = item
        return { ...car, ...driver }
      })
      responseUtil(res, 200, carDriverData)
    } else {
      responseUtil(res, 200, [])
    }
  } catch (error) {
    responseUtil(res, 500, error.message, true)
  }
}

module.exports = cardReservedList
