jest.autoMockOff();

var Calculator = require('../Calculator');

describe('Find final_tariff', function () {
  var calculator = new Calculator(
    "Защита",
    0,
    "Москва и МО",
    "Camry",
    2014,
    3000000,
    false,
    false,
    false,
    0,
    false,
    "до 3-х включительно",
    [4],
    [28],
    "Единовременно",
    false,
    "",
    0
  );

  it('base_tariff is 0.149796', function () {
    expect(1 * calculator.getTariff().toFixed(6)).toBe(0.149796);
  });

  it('base_tariff percent is 14.98%', function () {
    expect(calculator.getTariffPercent()).toBe('14.98%');
  });

  it('insurance premium is 449400', function () {
    expect(calculator.getPremium()).toBe(449400);
  });

});
