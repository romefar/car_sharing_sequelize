const { Op } = require('sequelize')
const { car } = require('../models')

const carsRelocate = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const cars = await car.update({
      geoLongtitude: 27.544,
      geoLatitude: 53.888
    },
    {
      where: {
        status: {
          [Op.notIn]: ['In use', 'Reserved']
        },
        useCounter: {
          [Op.gte]: 2
        }
      }
    })
    // TODO: Check the return value of the update function
    if (cars !== null) {
      // DOES NOT WORK
      const updatedCars = await car.findAll({ where: { geoLatitude: 53.888 } })
      res.statusCode = 200
      res.write(JSON.stringify({
        status: 200,
        cars: updatedCars
      }))
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

module.exports = carsRelocate
