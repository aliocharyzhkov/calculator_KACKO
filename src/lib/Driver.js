var cls = require('cls');

var coefficients = {
  Moscow: [
    [1.5, 1.3, undefined, undefined, undefined],
    [1.4, 1.14, 1.05, undefined, undefined],
    [1.25, 1, 0.9, 0.83, undefined],
    [1.2, 0.92, 0.86, 0.81, 0.73],
    [1.2, 0.87, 0.8, 0.73, 0.7],
    [1.2, 0.85, 0.78, 0.7, 0.65],
    [1.2, 0.82, 0.72, 0.65, 0.6],
    [1.2, 0.77, 0.7, 0.6, 0.6],
    [1.2, 0.77, 0.7, 0.6, 0.58],
    [1.2, 0.77, 0.7, 0.6, 0.58]
  ],
  Spb: [
    [1.5, 1.35, undefined, undefined, undefined],
    [1.4, 1.15, 1.05, undefined, undefined],
    [1.3, 1, 0.95, 0.85, undefined],
    [1.2, 0.9, 0.8, 0.8, 0.75],
    [1.2, 0.85, 0.75, 0.7, 0.7],
    [1.2, 0.8, 0.75, 0.7, 0.65],
    [1.2, 0.8, 0.7, 0.65, 0.65],
    [1.2, 0.75, 0.65, 0.6, 0.55],
    [1.2, 0.75, 0.6, 0.55, 0.55],
    [1.2, 0.75, 0.6, 0.55, 0.5]
  ],
  Other: [
    [1.5, 1.3, undefined, undefined, undefined],
    [1.4, 1.15, 1.05, undefined, undefined],
    [1.25, 1, 0.95, 0.85, undefined],
    [1.15, 0.9, 0.8, 0.75, 0.7],
    [1.1, 0.8, 0.75, 0.7, 0.7],
    [1.1, 0.8, 0.75, 0.7, 0.65],
    [1.1, 0.8, 0.7, 0.65, 0.62],
    [1.1, 0.75, 0.65, 0.6, 0.56],
    [1.1, 0.75, 0.65, 0.55, 0.53],
    [1.1, 0.75, 0.65, 0.55, 0.53]
  ]
};

var Driver = cls.extend({
  init: function (age, experience, region) {
    if (typeof age !== "number" || age < 18) {
      throw "Invalid age value";
    }
    if (typeof experience !== "number" || experience < 0) {
      throw "Invalid experience value";
    }

    this.age = age;
    this.experience = experience;
    if (/москва/i.test(region)) {
      this.coefficients = coefficients.Moscow;
    } else if (/санкт-петербург/i.test(region)) {
      this.coefficients = coefficients.Spb;
    } else {
      this.coefficients = coefficients.Other;
    }

  },
  getAgeIndex: function () {
    var index;

    if (this.age >= 60) {
      index = 9;
    } else if (this.age >= 55) {
      index = 8;
    } else if (this.age >= 50) {
      index = 7;
    } else if (this.age >= 45) {
      index = 6;
    } else if (this.age >= 40) {
      index = 5;
    } else if (this.age >= 35) {
      index = 4;
    } else if (this.age >= 30) {
      index = 3;
    } else if (this.age >= 25) {
      index = 2;
    } else if (this.age >= 22) {
      index = 1;
    } else if (this.age >= 18) {
      index = 0;
    }

    return index;
  },

  getExperienceIndex: function () {
    var index;

    if (this.experience >= 15) {
      index = 4;
    } else if (this.experience >= 10) {
      index = 3;
    } else if (this.experience >= 5) {
      index = 2;
    } else if (this.experience >= 3) {
      index = 1;
    } else if (this.experience >= 0) {
      index = 0;
    }

    return index;
  },

  getCoefficient: function () {
    return this.coefficients[this.getAgeIndex()][this.getExperienceIndex()];
  }
});

module.exports = Driver;
