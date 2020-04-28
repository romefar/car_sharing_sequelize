const base = require('./src/models')
base.sequelize.sync({ force: true })
  .then(() => {
    const car = base.car
    return car.create({
      vin: '3B7HF13Y81G193584',
      registrationNumber: '1234AB7',
      brand: 'Audi',
      model: 'A7',
      productionDate: '2018-10-10',
      status: 'Free',
      fuelCapacity: 60,
      fuelLevel: 60,
      mileage: 10000,
      geoLatitude: -121.5657546456,
      geoLongtitude: -121.5657546456
    })
  })
  .then(item => {
    return base.creditCard.create({
      cardNumber: '5500 0000 0000 0004',
      cardHolder: 'John Smith',
      cardValidDate: '2020-04-29'
    })
  })
  .then(item => {
    return base.driver.create({
      licenseNumber: '728392-NSDKF-2',
      firstName: 'John',
      lastName: 'Smith',
      creditCardId: 1
    })
  })
  .then((item) => {
    return base.run.create({
      startFuelLevel: 20,
      startMileage: 10000,
      driverId: 1
    })
  })
  .then(item => {
    return base.booking.create({
      runId: 1,
      carId: 1
    })
  })
  .then(() => {
    (async () => {
      const book = await base.sequelize.models.booking.findByPk(1)
      book.finishFuelLevel = 40
      await book.save()
    })()
  })
  .catch(err => console.log(err))
