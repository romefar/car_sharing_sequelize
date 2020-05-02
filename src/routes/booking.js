const { createBooking, bookingList, bookingStatusUpdate } = require('./booking/')
const responseUtil = require('../utils/resposeUtil')

const bookingRoute = (res, req, pathname) => {
  const { method } = req

  if (pathname === '/booking' && method === 'POST') {
    createBooking(req, res)
  } else if (pathname === '/booking/status' && method === 'PUT') {
    bookingStatusUpdate(req, res)
  } else if (pathname === '/booking' && method === 'GET') {
    bookingList(res)
  } else {
    responseUtil(res, 404, 'The requested URL was not found on the server.', true)
  }
}

module.exports = bookingRoute
