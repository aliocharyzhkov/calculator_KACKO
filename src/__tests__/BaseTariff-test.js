jest.autoMockOff();

var BaseTariff = require('../lib/BaseTariff');
var Car = require('../lib/Car');
var Model = require('../lib/Model');

describe('Find base_tariff', function () {
  it('base_tariff is 11.69%', function () {
    var group = new Model("Toyota", "Verso").getGroup();
    var age = Car.getAge(2013, /* is_new */ false, /* is_longation */ false);
    var region = "Санкт-Петербург и область";
    expect(BaseTariff.calculate(group, age, region)).toBe(11.69);
  });

  it('base_tariff is 8.75%', function () {
    var group = new Model("Toyota", "Prius").getGroup();
    var age = Car.getAge(2014, /* is_new */ false, /* is_longation */ false);
    var region = "Санкт-Петербург и область";
    expect(BaseTariff.calculate(group, age, region)).toBe(8.75);
  });
});
