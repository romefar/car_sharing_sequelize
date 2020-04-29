const http = require('http')
const chalk = require('chalk')
require('dotenv').config()

const { car, creditCard, driver, run, booking, sequelize: db } = require('./src/models')
const createTestData = require('./bulkFile')
const carsList = require('./src/routes/cars')

db.sync({ force: true }).then(async () => {
  await createTestData(car, creditCard, driver, run, booking)
  const server = http.createServer(async (req, res) => {
    switch (req.url) {
      case '/cars':
        carsList(req, res, car)
        break
      default:
        res.end('can\'t find.')
        break
    }
  })

  server.listen(process.env.PORT, () => {
    console.log(chalk.green(`Server is running on port ${process.env.PORT}.`))
  })
}).catch(err => console.log(err))
