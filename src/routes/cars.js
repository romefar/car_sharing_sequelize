const carsList = async (req, res, car) => {
  try {
    const cars = await car.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
    if (cars !== null) {
      const carsJSON = JSON.stringify(cars)
      res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': carsJSON.length })
      res.end(carsJSON)
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({}))
    }
  } catch (error) {
    res.statusCode = 404
    res.end(JSON.stringify({
      error
    }))
  }
}

module.exports = carsList
