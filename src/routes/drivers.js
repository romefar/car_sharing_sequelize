const responseUtil = require('../utils/resposeUtil')
const {
  createDriver,
  authDriverCard,
  driversList,
  driversRun
} = require('./drivers/')

const driversRoute = (res, req, pathname) => {
  const { method } = req

  if (pathname === '/drivers' && method === 'POST') {
    createDriver(req, res)
  } else if (pathname === '/drivers/card/auth' && method === 'PUT') {
    authDriverCard(req, res)
  } else if (pathname === '/drivers' && method === 'GET') {
    driversList(res)
  } else if (pathname === '/drivers/runs' && method === 'GET') {
    driversRun(req, res)
  } else {
    responseUtil(res, 404, 'The requested URL was not found on the server.', true)
  }
}

module.exports = driversRoute
