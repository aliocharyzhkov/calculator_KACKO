var cls = require('cls');

var tariffs = {
  // Структура объекта
  // group: [zero_years, one_year]
  "Moscow": {
    1: [10.74, 12.63],
    2: [7.87, 10.21],
    3: [5.5, 6.85]
  },
  "Spb": {
    1: [11.93, 14.29],
    2: [8.01, 10.7],
    3: [5.41, 7.16]
  },
  "Other": {
    1: [10.67, 12.23],
    2: [8.19, 10.58],
    3: [6.41, 8.45]
  }
};

var BaseTariff = cls.extend({
  statics: {
    calculate: function (group, age, region) {
      var tariff;

      if (/москва/i.test(region)) {
        tariff = tariffs.Moscow;
      } else if (/санкт-петербург/i.test(region)) {
        tariff = tariffs.Spb;
      } else {
        tariff = tariffs.Other;
      }

      return tariff[group][age];
    }
  }
});

module.exports = BaseTariff;
