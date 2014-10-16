jest.autoMockOff();

var BaseTariff = require('../lib/BaseTariff');
var Car = require('../lib/Car');
var Model = require('../lib/Model');

describe('Find base_tariff', function () {
  var group = new Model("Toyota", "Verso").getGroup();
  var age = Car.getAge(2013, /* is_new */ false, /* is_longation */ false);
  var region = "Санкт-Петербург и область";
  it('base_tariff is 10.70%', function () {
    expect(BaseTariff.calculate(group, age, region)).toBe(10.70);
  });

});
