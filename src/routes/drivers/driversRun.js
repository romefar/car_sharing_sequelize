const { booking, run, car } = require('../../models')
const { Op } = require('sequelize')
const responseUtil = require('../../utils/resposeUtil')
const { BOOKING_CLOSED, BOOKING_CANCELLED } = require('../../utils/bookingsStatus')

const driversRun = async (req, res) => {
  let data = ''

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const { driverId } = JSON.parse(data)
      const runs = await booking.findAll({
        where: {
          status: {
            [Op.in]: [BOOKING_CLOSED, BOOKING_CANCELLED]
          }
        },
        attributes: [],
        include: [{
          model: run,
          attributes: { exclude: ['createdAt', 'updatedAt', 'driverId'] },
          where: {
            driverId
          }
        }, {
          model: car,
          attributes: ['brand', 'model', 'vin']
        }]
      })
      if (runs[0] !== 0) {
        responseUtil(res, 200, runs)
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

module.exports = driversRun
