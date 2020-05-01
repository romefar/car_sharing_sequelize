const responseUtil = require('../utils/resposeUtil')
const {
  carsList,
  createCar,
  carsReserved,
  carsRelocate,
  carsService,
  carsRemove
} = require('./cars/')

const carsRoute = (res, req, pathname, searchParams) => {
  const { method } = req

  if (pathname === '/cars' && method === 'GET') {
    carsList(res, searchParams)
  } else if (pathname === '/cars/reserved/unauthorized' && method === 'GET') {
    carsReserved(res)
  } else if (pathname === '/cars' && method === 'POST') {
    createCar(req, res)
  } else if (pathname === '/cars/service' && method === 'PUT') {
    carsService(res)
  } else if (pathname === '/cars/relocate' && method === 'PUT') {
    carsRelocate(res)
  } else if (pathname === '/cars' && method === 'DELETE') {
    carsRemove(req, res)
  } else {
    responseUtil(res, 404, 'The requested URL was not found on the server.', true)
  }
}

module.exports = carsRoute
