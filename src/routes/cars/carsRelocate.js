const { Op } = require('sequelize')
const { car } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const {
  CAR_IN_USE,
  CAR_RESERVED
} = require('../../utils/carStatus')

const carsRelocate = async (res) => {
  try {
    const cars = await car.update({
      geoLongtitude: 27.54426,
      geoLatitude: 53.88828
    },
    {
      where: {
        status: {
          [Op.notIn]: [CAR_IN_USE, CAR_RESERVED]
        },
        useCounter: {
          [Op.gte]: 2
        }
      }
    })

    if (cars[0] !== 0) {
      const updatedCars = await car.findAll({
        where: {
          status: {
            [Op.notIn]: [CAR_IN_USE, CAR_RESERVED]
          },
          useCounter: {
            [Op.gte]: 2
          }
        },
        limit: 10
      })

      responseUtil(res, 200, updatedCars)
    } else {
      responseUtil(res, 200, [])
    }
  } catch (error) {
    responseUtil(res, 500, error.message, true)
  }
}

module.exports = carsRelocate
