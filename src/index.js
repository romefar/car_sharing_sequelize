const http = require('http')
const chalk = require('chalk')
require('dotenv/config')

const responseUtil = require('./utils/resposeUtil')
const { carsRoute, driversRoute, bookingRoute } = require('./routes')
const { car, creditCard, driver, run, booking, sequelize: db } = require('./models')
const createTestData = require('./bulkFile')

db.sync({ force: true }).then(async () => {
  await createTestData(car, creditCard, driver, run, booking)
  const server = http.createServer(async (req, res) => {
    try {
      const { url: reqUrl } = req
      const { pathname, searchParams } = new URL(reqUrl, process.env.DEV_HOST || `https://${req.headers.host}`)
      console.log(req.headers.host)
      const route = pathname.split('/')

      if (route.includes('cars')) {
        carsRoute(res, req, pathname, searchParams)
      } else if (route.includes('drivers')) {
        driversRoute(res, req, pathname)
      } else if (route.includes('booking')) {
        bookingRoute(res, req, pathname)
      } else {
        responseUtil(res, 404, 'The requested URL was not found on the server.', true)
      }
    } catch (error) {
      console.log(chalk.red(error))
    }
  })

  const port = process.env.PORT || 3000

  server.listen(port, () => {
    console.log(chalk.green(`Server is running on port ${port}.`))
  })
}).catch(err => console.log(err))
