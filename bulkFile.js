const createTestData = async (car, creditCard, driver, run, booking) => {
  try {
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
      geoLatitude: -121.56545,
      geoLongtitude: 333.56576
    })
    await car.create({
      vin: '5TFJU4GN8FX074123',
      registrationNumber: '5446AB7',
      brand: 'Mercedes-Benz',
      model: 'SLR',
      productionDate: '2018-11-11',
      status: 'Free',
      fuelCapacity: 45,
      fuelLevel: 45,
      mileage: 2000,
      geoLatitude: -121.24243,
      geoLongtitude: 333.43534
    })
    await car.create({
      vin: 'JA4LS21H13J046792',
      registrationNumber: '5999AB7',
      brand: 'Toyota',
      model: 'Corolla',
      productionDate: '2015-11-11',
      status: 'Free',
      fuelCapacity: 55,
      fuelLevel: 55,
      mileage: 145432,
      geoLatitude: -111.24243,
      geoLongtitude: -111.43534
    })
    await car.create({
      vin: 'WBAWB335X7P181541',
      registrationNumber: '5959AB7',
      brand: 'Skoda',
      model: 'Superb',
      productionDate: '2017-02-21',
      status: 'Free',
      fuelCapacity: 56,
      fuelLevel: 56,
      mileage: 185432,
      geoLatitude: -100.24243,
      geoLongtitude: -100.43534
    })
    await creditCard.create({
      cardNumber: '5500 0000 0000 0004',
      cardHolder: 'John Smith',
      cardValidDate: '2020-06-29'
    })
    await creditCard.create({
      cardNumber: '4197 3942 1555 3472',
      cardHolder: 'Jessica Miles',
      cardValidDate: '2020-08-20'
    })
    await creditCard.create({
      cardNumber: '4588 6257 8786 1265',
      cardHolder: 'Mike Jordan',
      cardValidDate: '2020-10-15'
    })

    await driver.create({
      licenseNumber: '728392-NSDKF-2',
      firstName: 'John',
      lastName: 'Smith',
      creditCardId: 1
    })
    await driver.create({
      licenseNumber: '928392-NSDKF-2',
      firstName: 'Jessica',
      lastName: 'Miles',
      creditCardId: 2
    })
    await driver.create({
      licenseNumber: '528392-NSDKF-2',
      firstName: 'Mike',
      lastName: 'Jordan',
      creditCardId: 3
    })
    await booking.create({
      carId: 1
    }, { driverId: 1 })
  } catch (error) {
    console.log(`\n${error}\n`)
  }
}

module.exports = createTestData
