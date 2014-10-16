jest.autoMockOff();

var Driver = require('../lib/Driver');
var driver;

describe('Find driver\'s coefficients', function () {
  it('Coef equals 0.85', function () {
    driver = new Driver(40, 4, 'Москва');
    expect(driver.getCoefficient()).toBe(0.85);
  });

  it('Coef equals 0.7', function () {
    driver = new Driver(45, 8, 'Санкт-Петербург');
    expect(driver.getCoefficient()).toBe(0.7);
  });

  it('Coef equals 0.53', function () {
    driver = new Driver(65, 15, 'Тверская область');
    expect(driver.getCoefficient()).toBe(0.53);
  });

});
