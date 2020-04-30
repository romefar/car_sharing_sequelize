const http = require('http')
const chalk = require('chalk')
require('dotenv').config()

const { car, creditCard, driver, run, booking, sequelize: db } = require('./src/models')
const createTestData = require('./bulkFile')
const carsList = require('./src/routes/carsList')
const carsReserved = require('./src/routes/carsReserved')
const createCar = require('./src/routes/createCar')
const carsService = require('./src/routes/carsService')
const carsRelocate = require('./src/routes/carsRelocate')
const carsRemove = require('./src/routes/carsRemove')

db.sync({ force: true }).then(async () => {
  await createTestData(car, creditCard, driver, run, booking)
  const server = http.createServer(async (req, res) => {
    try {
      const { url: reqUrl, method } = req
      const { pathname, searchParams } = new URL(reqUrl, process.env.DEV_HOST)
      console.log(pathname, method)
      if (pathname === '/cars' && method === 'GET') {
        carsList(req, res, car, searchParams)
      } else if (pathname === '/cars/reserved/unauthorized' && method === 'GET') {
        carsReserved(req, res)
      } else if (pathname === '/cars' && method === 'POST') {
        createCar(req, res)
      } else if (pathname === '/cars/service' && method === 'PUT') {
        carsService(req, res)
      } else if (pathname === '/cars/relocate' && method === 'PUT') {
        carsRelocate(req, res)
      } else if (pathname === '/cars' && method === 'DELETE') {
        carsRemove(req, res)
      } else {
        res.writeHead(404, { 'Content-type': 'application/json' })
        res.write(JSON.stringify({
          status: 404,
          message: 'The requested URL was not found on the server.'
        }))
        res.end()
      }
    } catch (error) {
      console.log(chalk.red(error))
    }
  })

  server.listen(process.env.PORT, () => {
    console.log(chalk.green(`Server is running on port ${process.env.PORT}.`))
  })
}).catch(err => console.log(err))
