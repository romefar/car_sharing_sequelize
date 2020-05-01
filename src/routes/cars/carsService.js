const { Op } = require('sequelize')
const { car } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const carsService = async (res) => {
  try {
    const serviceDate = `${new Date().getFullYear() - 3}-01-01`
    const cars = await car.update({ status: 'In service' }, {
      where: {
        status: {
          [Op.notIn]: ['In use', 'Reserved']
        },
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
      }
    })

    if (cars[0] !== 0) {
      const updatedCars = await car.findAll({
        where: {
          status: 'In service',
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
        }
      })
      responseUtil(res, 200, updatedCars)
    } else {
      responseUtil(res, 200, [])
    }
  } catch (error) {
    responseUtil(res, 500, error.message, true)
  }
}

module.exports = carsService
