var cls = require('cls');

var marks = ["Toyota"];

var models = {
  "Toyota": [
    "Auris",
    "Avensis",
    "Camry",
    "Corolla",
    "GT86",
    "Highlander",
    "Hilux",
    "Land Cruiser 150 Prado",
    "Land Cruiser 200",
    "Prius",
    "RAV 4",
    "Venza",
    "Verso"
  ]
};

// Каждой модели соответствует массив групповых коэффициентов.
// В калькуляторе определено две группы, но на деле используется
// только одна, первая.
var groups = {
  "Toyota": {
    "Auris": [1, 1],
    "Avensis": [2, 2],
    "Camry": [2, 2],
    "Corolla": [1, 1],
    "GT86": [2, 2],
    "Highlander": [2, 2],
    "Hilux": [2, 2],
    "Land Cruiser 150 Prado": [3, 3],
    "Land Cruiser 200": [3, 3],
    "Prius": [2, 2],
    "RAV 4": [2, 2],
    "Venza": [2, 2],
    "Verso": [2, 2]
  }
};

var Model = cls.extend({
  init: function (mark, model) {
    this.mark = mark;
    this.model = model;

    // В калькуляторе захардкодено это значение.
    // Хотя вообще оно должно определяться по типу авто (Car.js):
    // if Car.getTypeCoef(type) === 7 then group = 0 else group = 1
    this.groupIndex = 0;
  },

  getGroup: function () {
    return groups[this.mark][this.model][this.groupIndex];
  },

  statics: {
    getMarks: function () {
      return marks;
    },
    getModels: function (mark) {
      return models[mark];
    }
  }
});

module.exports = Model;
