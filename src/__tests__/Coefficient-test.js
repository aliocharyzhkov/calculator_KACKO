jest.autoMockOff();

var Coefficient = require('../lib/Coefficient');
var Model = require('../lib/Model');
var coef;

describe('Find coefficients', function () {

  it('K1 equals 0.53', function () {
    coef = Coefficient.getK1({
      client_type: "Физическое лицо",
      is_multidrive: false,
      group: new Model("Toyota", "Corolla").getGroup(),
      region: "Тверская область",
      franchise: 0,
      ds_restrict: false,
      driver_ages: [65],
      driver_expreriences: [15]
    });
    expect(coef).toBe(0.53);
  });

  it('K1 equals 1.5', function () {
    coef = Coefficient.getK1({
      client_type: "Физическое лицо",
      is_multidrive: true,
      group: new Model("Toyota", "Corolla").getGroup(),
      region: "Москва и МО",
      franchise: 0,
      ds_restrict: false,
      driver_ages: [],
      driver_expreriences: []
    });
    expect(coef).toBe(1.5);
  });

  it('K1d equals 1.05', function () {
    coef = Coefficient.getK1d({
      client_type: "Физическое лицо",
      is_multidrive: false,
      group: new Model("Toyota", "Hilux").getGroup(),
      region: "Москва и МО",
      franchise: 10000,
      drivers_num: 5,
      driver_ages: [43],
      driver_expreriences: [10]
    });
    expect(coef).toBe(1.05);
  });

  it('K3 equals 1', function () {
    coef = Coefficient.getK3({
      installments: "Единовременно",
      period: "1 год"
    });
    expect(coef).toBe(1);
  });

  it('K4 equals 0.9', function () {
    coef = Coefficient.getK4({
      client_type: "Физическое лицо",
      group: new Model("Toyota", "Hilux").getGroup(),
      franchise: 10000,
    });
    expect(coef).toBe(0.9);
  });

  it('K4 equals 0.75', function () {
    coef = Coefficient.getK4({
      client_type: "Физическое лицо",
      group: new Model("Toyota", "Venza").getGroup(),
      franchise: 25000,
    });
    expect(coef).toBe(0.75);
  });

  it('Kp equals 0.91', function () {
    coef = Coefficient.getKp({
      region: "Тюменская область",
      group: new Model("Toyota", "Venza").getGroup(),
    });
    expect(coef).toBe(0.91);
  });

  it('Kc equals 0.97', function () {
    coef = Coefficient.getKc({
      installments: "Единовременно",
      discount_kv: 3
    });
    expect(coef).toBe(0.97);
  });

  it('Kc equals 1', function () {
    coef = Coefficient.getKc({
      installments: "2 платежа",
      discount_kv: 3
    });
    expect(coef).toBe(1);
  });

  it('Kap equals 1.12', function () {
    coef = Coefficient.getKap({
      region: "Москва и МО",
      mark: "Toyota",
      model: "Auris"
    });
    expect(coef).toBe(1.12);
  });

  it('Kb equals 1.1', function () {
    coef = Coefficient.getKb({
      region: "Санкт-Петербург и область",
      bank: "Ак Барс",
      client_type: "Физическое лицо"
    });
    expect(coef).toBe(1.1);
  });

  it('Kb equals 1', function () {
    coef = Coefficient.getKb({
      region: "Санкт-Петербург и область",
      bank: "РГС Банк",
      client_type: "Физическое лицо"
    });
    expect(coef).toBe(1);
  });

  it('Kprogram equals 1.02', function () {
    coef = Coefficient.getKprogram({
      action: 1,
      region: "Санкт-Петербург и область",
      no_pss: true,
      model: "Prius"
    });
    expect(coef).toBe(1.02);
  });

});
