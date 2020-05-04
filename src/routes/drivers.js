const responseUtil = require('../utils/resposeUtil')
const {
  createDriver,
  authDriverCard,
  driversList,
  driversRun
} = require('./drivers/')

const driversRoute = (res, req, pathname) => {
  const { method } = req

  if (pathname === '/api/v1/drivers' && method === 'POST') {
    createDriver(req, res)
  } else if (pathname === '/api/v1/drivers/card/auth' && method === 'PUT') {
    authDriverCard(req, res)
  } else if (pathname === '/api/v1/drivers' && method === 'GET') {
    driversList(res)
  } else if (pathname === '/api/v1/drivers/runs' && method === 'GET') {
    driversRun(req, res)
  } else {
    responseUtil(res, 404, 'The requested URL was not found on the server.', true)
  }
}

module.exports = driversRoute
