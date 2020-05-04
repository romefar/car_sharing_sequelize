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

  if (pathname === '/api/v1/cars' && method === 'GET') {
    carsList(res, searchParams)
  } else if (pathname === '/api/v1/cars/reserved/unauthorized' && method === 'GET') {
    carsReserved(res)
  } else if (pathname === '/api/v1/cars' && method === 'POST') {
    createCar(req, res)
  } else if (pathname === '/api/v1/cars/service' && method === 'PUT') {
    carsService(res)
  } else if (pathname === '/api/v1/cars/relocate' && method === 'PUT') {
    carsRelocate(res)
  } else if (pathname === '/api/v1/cars' && method === 'DELETE') {
    carsRemove(req, res)
  } else {
    responseUtil(res, 404, 'The requested URL was not found on the server.', true)
  }
}

module.exports = carsRoute
