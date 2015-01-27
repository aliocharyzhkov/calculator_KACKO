var cls = require('cls');
var moment = require('moment');

var types = {
  "Легковой":             7,
  "Грузовой (до 5 тонн)": 7,
  "Грузовой (от 5 тонн)": 8,
  "Автобус (до 18 мест)": 7,
  "Автобус (от 19 мест)": 8,
  "Прицеп":               7,
  "Спецтехника":          7,
};

var Car = cls.extend({
  statics: {
    getAge: function (year, is_new, is_longation) {
      var age;

      // Каждый год нужно менять значения этих констант
      var LAST_YEAR = 2014;
      var MAGIC_DATE = '2015-06-30';

      if (year == LAST_YEAR && is_longation) {
        age = 1;
      } else {
        if (year == LAST_YEAR && is_new && moment() <= moment(MAGIC_DATE)) {
          age = 0;
        } else {
          age = moment().year() - year;
        }
      }

      return age;
    },

    getTypes: function() {
      return Object.keys(types);
    },

    getTypeCoef: function (type) {
      return types[type];
    }
  }
});

module.exports = Car;
