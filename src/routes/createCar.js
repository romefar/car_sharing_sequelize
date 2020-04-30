const { car } = require('../models')

const createCar = async (req, res) => {
  let data = ''
  res.setHeader('Content-Type', 'application/json')

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const carData = JSON.parse(data)
      const newCar = await car.create(carData)
      res.statusCode = 201
      res.write(JSON.stringify({
        status: 201,
        car: newCar
      }))
      res.end()
    } catch (error) {
      const msg = error.errors ? error.errors[0].message : error.message
      res.statusCode = 400
      res.write(JSON.stringify({
        status: 400,
        error: msg
      }))
      res.end()
    }
  })
  req.on('error', (error) => {
    res.writeHead(500, 'Content-Type: application/json')
    res.write(JSON.stringify({
      status: 500,
      error
    }))
    res.end()
  })
}

module.exports = createCar
