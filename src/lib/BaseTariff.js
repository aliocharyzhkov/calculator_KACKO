var cls = require('cls');

var tariffs = {
  // Структура объекта
  // group: [zero_years, one_year]
  "Moscow": {
    1: [11.95, 14.06],
    2: [8.76, 11.36],
    3: [6.12, 7.85]
  },
  "Spb": {
    1: [13.03, 15.61],
    2: [8.75, 11.69],
    3: [5.91, 7.82]
  },
  "Other": {
    1: [11.66, 13.36],
    2: [8.95, 11.56],
    3: [7, 9.23]
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
