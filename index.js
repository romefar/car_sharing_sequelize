const http = require('http')
const chalk = require('chalk')
require('dotenv/config')

const responseUtil = require('./src/utils/resposeUtil')
const { carsRoute, driversRoute, bookingRoute } = require('./src/routes')
const { car, creditCard, driver, run, booking, sequelize: db } = require('./src/models')
const createTestData = require('./bulkFile')

db.sync({ force: true }).then(async () => {
  await createTestData(car, creditCard, driver, run, booking)
  const server = http.createServer(async (req, res) => {
    try {
      const { url: reqUrl } = req
      const { pathname, searchParams } = new URL(reqUrl, process.env.DEV_HOST || process.env.DB_HOSTNAME)
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

  server.listen(process.env.PORT, () => {
    console.log(chalk.green(`Server is running on port ${process.env.PORT}.`))
  })
}).catch(err => console.log(err))
