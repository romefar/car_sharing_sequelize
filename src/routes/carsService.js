const { Op } = require('sequelize')
const { car } = require('../models')

const carsService = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const date = new Date()
    const serviceDate = `${date.getFullYear() - 3}-01-01`
    const cars = await car.update({
      status: 'In service'
    },
    {
      where: {
        [Op.or]: [
          {
            productionDate: {
              [Op.lte]: serviceDate
            }
          },
          {
            mileage: {
              [Op.gte]: 100000
            }
          }
        ]
      },
      returning: true,
      plain: true
    })
    // TODO: Check the return value of the update function
    if (cars !== null) {
      const updatedCars = await car.findAll({ where: { status: 'In service' } })
      console.log(cars)
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

module.exports = carsService
