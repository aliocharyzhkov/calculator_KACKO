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

  it('base_tariff is 0.121985', function () {
    expect(1 * calculator.getTariff().toFixed(6)).toBe(0.121985);
  });

  it('base_tariff percent is 12.20%', function () {
    expect(calculator.getTariffPercent()).toBe('12.20%');
  });

  it('insurance premium is 366000', function () {
    expect(calculator.getPremium()).toBe(366000);
  });

});
