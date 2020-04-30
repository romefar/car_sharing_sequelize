const createTestData = async (car, creditCard, driver, run, booking) => {
  await car.create({
    vin: '3B7HF13Y81G193584',
    registrationNumber: '1234AB7',
    brand: 'Audi',
    model: 'A7',
    productionDate: '2018-10-10',
    status: 'Free',
    fuelCapacity: 60,
    fuelLevel: 60,
    mileage: 145000,
    geoLatitude: -121.5657546456,
    geoLongtitude: -121.5657546456
  })
  await creditCard.create({
    cardNumber: '5500 0000 0000 0004',
    cardHolder: 'John Smith',
    cardValidDate: '2020-06-29'
  })

  await driver.create({
    licenseNumber: '728392-NSDKF-2',
    firstName: 'John',
    lastName: 'Smith',
    creditCardId: 1
  })
  await booking.create({
    carId: 1
  }, { driverId: 1 })
}

module.exports = createTestData
