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

      // Логика вычисления возраста машины вызвала вопросы,
      // особенно захардкоденное значение -- 2013.
      if (year == 2013 && is_longation) {
        age = 1;
      } else {
        if (year == 2013 && is_new && moment() <= moment('2014-06-30')) {
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
