var cls = require('cls');
var Model = require('./lib/Model');
var Car = require('./lib/Car');
var BaseTariff = require('./lib/BaseTariff');
var Coefficient = require('./lib/Coefficient');

var Calculator = cls.extend({
  init: function (
    insurance_type,         // Вариант страховки (Базовый, Расширенный, Премиальный)
    discount_kv,            // Cкидка за счет КВ
    region,                 // Регион
    model,                  // Модель
    year,                   // Год выпуска
    insurance_money,        // Стоимость
    gap,                    // GAP
    is_new,                 // ТС новое
    no_pss,                 // Без установки противоугонной системы
    franchise,              // Франшиза
    is_multidrive,          // Мультидрайв
    drivers_num,            // Число допущенных
    driver_expreriences,    // Стаж
    driver_ages,            // Возраст
    installments,           // Рассрочка платежаб
    trailer,                // С прицепом
    is_car_loan,            // Кредитное ТС
    insurance_money_dsago   // Страховая сумма по ДСАГО
  ) {
    this.insurance_type = insurance_type;
    this.discount_kv = parseInt(discount_kv, 10);
    this.region = region;
    // Значение неизменно
    this.client_type = "Физическое лицо";
    // Значение неизменно
    this.mark = "Toyota";
    this.model = model;
    this.year = parseInt(year, 10);
    this.insurance_money = parseInt(insurance_money, 10);
    this.gap = gap;
    this.is_new = is_new;
    this.no_pss = no_pss;
    this.franchise = parseInt(franchise, 10);
    this.is_multidrive = is_multidrive;
    this.drivers_num = drivers_num;
    this.driver_expreriences = driver_expreriences.map(function (experience) {
      return parseInt(experience, 10);
    });
    this.driver_ages= driver_ages.map(function (age) {
      return parseInt(age, 10);
    });
    this.installments = installments;
    this.trailer = trailer;

    // Любой банк
    if (is_car_loan) {
      // Здесь может быть любая непустая строка кроме "РГС Банк"
      this.bank = 'любой';
    // Нет банка
    } else {
      this.bank = '';
    }

    this.insurance_money_dsago = parseInt(insurance_money_dsago, 10);

    if (this.insurance_type === "Базовый") {
      this.action = 1;
    } else if (this.insurance_type === "Расширенный") {
      this.action = 2;
    } else if (this.insurance_type === "Премиальный") {
      this.action = 3;
    } else {
      throw "Invalid insurance_type";
    }
  },
  getTariff: function () {

    // Constants

    var period = '1 год',       // Срок
        is_longation = false,   // Договор является лонгацией
        ds_restrict = false,    // Эта константа не определена в Экселе, но используется в формулах

    // Coefficients

        K1,                     // стаж-возраст
        K1d,                    // коэффициент по количеству допущенных
        K2 = 1,                 // число застрахованных ТС
        K3,                     // коэффициент срока
        K4,                     // коэффициент франшизы
        K5 = 1,                 // коэффициент пролонгации
        K6 = 1,                 // коэффициент безубыточности по ОСАГО
        K7A = 1,                // коэффициент способа возмещения ущерба
        Kp,                     // коэффициент региона
        Kc,                     // коэффициент скоринга
        Ku = 1,                 // коэффициент юридических лиц
        Ka = 1,                 // коэффициент андеррайтера для спец. условий по КВ
        Kap,                    // коэффициент андеррайтера по маркам и моделям ТС
        Kpc,                    // коэффициент рассрочки
        Knp = 1,                // коэффициент программы
        Kprisk = 1,             //
        Kb,                     // коэффициент банка
        Kprogram,

    // Other

        base_tariff,            // Базовый тариф
        final_tariff,           // Итоговый тариф
        group,                  // Группа автомобиля
        i;

    group = new Model(this.mark, this.model).getGroup();

    base_tariff = BaseTariff.calculate(group, Car.getAge(this.year, this.is_new, this.is_longation), this.region);

    K1 = Coefficient.getK1({
      client_type: this.client_type,
      is_multidrive: this.is_multidrive,
      group: group,
      region: this.region,
      franchise: this.franchise,
      ds_restrict: this.ds_restrict,
      driver_ages: this.driver_ages,
      driver_expreriences: this.driver_expreriences
    });

    K1d = Coefficient.getK1d({
      client_type: this.client_type,
      is_multidrive: this.is_multidrive,
      group: group,
      region: this.region,
      franchise: this.franchise,
      drivers_num: this.drivers_num,
      driver_ages: this.driver_ages,
      driver_expreriences: this.driver_expreriences
    });

    K3 = Coefficient.getK3({
      installments: this.installments,
      period: period
    });

    K4 = Coefficient.getK4({
      group: group,
      franchise: this.franchise,
      client_type: this.client_type,
      bank: this.bank
    });

    Kp = Coefficient.getKp({
      region: this.region,
      group: group
    });

    Kc = Coefficient.getKc({
      installments: this.installments,
      discount_kv: this.discount_kv
    });

    Kap = Coefficient.getKap({
      region: this.region,
      mark: this.mark,
      model: this.model
    });

    Kpc = Coefficient.getKpc({
      installments: this.installments
    });

    Kb = Coefficient.getKb({
      bank: this.bank,
      client_type: this.client_type,
      region: this.region
    });

    Kprogram = Coefficient.getKprogram({
      region: this.region,
      action: this.action,
      no_pss: this.no_pss,
      model: this.model
    });

    final_tariff = (base_tariff / 100) * K1 * K1d * K2 * K3 * K4 * K5 * K6 * K7A * Kp * Kc * Ku * Ka * Kap * Kpc * Knp * Kprisk * Kb * Kprogram;

    if (this.gap) {
      final_tariff += 0.009;
    }

    return final_tariff;
  },
  getTariffPercent: function () {
    return (this.getTariff() * 100).toFixed(2) + '%';
  },
  getPremium: function () {
    return Math.round(this.getTariff().toFixed(4) * this.insurance_money);
  },
  getPremiumDsago: function () {
    if (!this.insurance_money_dsago) {
      return 0;
    }

    // TODO: Дозаполнить таблицу ''базовые тарифы'!$AI$145:$AS$1520
    // Так как is_dsago_longation всегда равно 0, то второй столбец
    // для каждой суммы мы опускаем.
    var coefficients = {
      "Санкт-Петербург и область": {
        // trailer
        0: {
          // dsago money
          300000: 1850,
          600000: 3000,
          1000000: 5900,
          1500000: 6500,
          3000000: 7500
        },
        1: {
          300000: 2000,
          600000: 3150,
          1000000: 6050,
          1500000: 6650,
          3000000: 7650
        }
      },
      "Москва и МО": {
        // trailer
        0: {
          // dsago money
          300000: 1850,
          600000: 3000,
          1000000: 5900,
          1500000: 6500,
          3000000: 7500
        },
        1: {
          300000: 2000,
          600000: 3150,
          1000000: 6050,
          1500000: 6650,
          3000000: 7500
        }
      },
      "Тюменская область": {
        // trailer
        0: {
          // dsago money
          300000: 1500,
          600000: 2750,
          1000000: 5600,
          1500000: 6300,
          3000000: 7300
        },
        1: {
          300000: 1650,
          600000: 2900,
          1000000: 5750,
          1500000: 6450,
          3000000: 7450
        }
      }
    };

    return Math.round(coefficients[this.region][this.trailer ? 1 : 0][this.insurance_money_dsago]);
  },
  getPremiumTotal: function () {
    return this.getPremium() + this.getPremiumDsago();
  }
});

module.exports = Calculator;

