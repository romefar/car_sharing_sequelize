const { car, creditCard, driver, run, booking } = require('../models')
const cardReservedList = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json')

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

    if (data !== null) {
      const jsonTmp = JSON.parse(JSON.stringify(data))
      const dataList = jsonTmp.map(item => {
        const { car, run: { driver } } = item
        return { ...car, ...driver }
      })
      res.write(JSON.stringify({
        status: 200,
        cars: dataList
      }))
      res.statusCode = 200
      res.end()
    } else {
      res.statusCode = 200
      res.write(JSON.stringify({
        status: 200,
        cars: []
      }))
      res.end()
    }
  } catch (error) {
    res.statusCode = 500
    res.write(JSON.stringify({
      status: 500,
      error: error.message
    }))
    res.end()
  }
}

module.exports = cardReservedList
