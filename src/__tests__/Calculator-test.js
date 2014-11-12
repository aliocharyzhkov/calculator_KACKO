jest.autoMockOff();

var Calculator = require('../Calculator');

describe('Find final_tariff', function () {
  var calculator = new Calculator(
    "Базовый",
    0,
    "Санкт-Петербург и область",
    "Prius",
    2014,
    3000000,
    true,
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
    1000000
  );

  it('base_tariff is 0.09825', function () {
    expect(1 * calculator.getTariff().toFixed(5)).toBe(0.09825);
  });

  it('base_tariff percent is 9.83%', function () {
    expect(calculator.getTariffPercent()).toBe('9.83%');
  });

  it('insurance premium is 294900', function () {
    expect(calculator.getPremium()).toBe(294900);
  });

});
