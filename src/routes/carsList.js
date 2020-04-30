const { Op } = require('sequelize')

const carsList = async (req, res, car, searchParams) => {
  let requestError = true
  try {
    res.setHeader('Content-Type', 'application/json')
    const options = {}

    for (const [key, value] of searchParams) {
      if (value) validateFields(key, value, options)
    }
    requestError = false

    const cars = await car.findAll({ where: options, attributes: { exclude: ['createdAt', 'updatedAt'] } })

    if (cars !== null) {
      const carsJSON = JSON.stringify({ statusCode: 200, cars })
      res.statusCode = 200
      res.write(carsJSON)
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
    const status = requestError ? 400 : 500
    res.statusCode = status
    res.write(JSON.stringify({
      status,
      error: error.message
    }))
    res.end()
  }
}

const capLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)
const checkStatus = (str) => ['Free', 'In use', 'Unavailable', 'In service', 'Reserved'].includes(str)
const checkAvailableFields = (str) => ['status', 'fuelLevel', 'brand', 'model', 'mileage', 'used'].includes(str)
const validateFields = (key, value, options) => {
  const isAvailableField = checkAvailableFields(key)
  if (!isAvailableField) throw new Error(`Unknown search parameter (${key}).`)

  let isValid = false
  const errorMsg = `Invalid '${key}' value.`
  switch (key) {
    case 'status':
      isValid = checkStatus(capLetter(value))
      if (!isValid) throw new Error(errorMsg)
      options[key] = value
      break
    case 'fuelLevel':
      if (!value.match(/^[0-9]+$/g)) throw new Error(errorMsg)
      options.fuelLevel = { [Op.lte]: value }
      break
    case 'brand':
      if (!value.match(/^[a-zA-Z-]+$/g)) throw new Error(errorMsg)
      options[key] = value
      break
    case 'model':
      if (!value.match(/^[a-zA-Z0-9-]+$/g)) throw new Error(errorMsg)
      options[key] = value
      break
    case 'mileage':
      if (!value.match(/^[0-9]+$/g)) throw new Error('Invalid \'mileage\' value.')
      options.mileage = { [Op.gte]: value }
      break
    case 'used':
      if (!value.match(/^[0-9]+$/g)) throw new Error('Invalid \'used\' value.')
      options.useCounter = { [Op.gte]: value }
      break
    default:
      throw new Error(`Unknown ${key} value.`)
  }
}

module.exports = carsList
