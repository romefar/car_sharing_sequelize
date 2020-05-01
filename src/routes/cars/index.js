const carsList = require('./carsList')
const carsReserved = require('./carsReserved')
const createCar = require('./createCar')
const carsService = require('./carsService')
const carsRelocate = require('./carsRelocate')
const carsRemove = require('./carsRemove')

module.exports = {
  carsList,
  createCar,
  carsReserved,
  carsRelocate,
  carsService,
  carsRemove
}
