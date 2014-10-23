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

  it('base_tariff is 0.090702', function () {
    expect(calculator.getTariff()).toBe(0.090702);
  });

  it('base_tariff percent is 9.07%', function () {
    expect(calculator.getTariffPercent()).toBe('9.07%');
  });

  it('insurance premium is 272100', function () {
    expect(calculator.getPremium()).toBe(272100);
  });

  it('insurance premium dsago is 5900', function () {
    expect(calculator.getPremiumDsago()).toBe(5900);
  });

  it('insurance premium total is 36110', function () {
    expect(calculator.getPremiumTotal()).toBe(278000);
  });

});
