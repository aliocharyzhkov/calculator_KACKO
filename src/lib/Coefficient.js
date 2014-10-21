var Driver = require('./Driver');

exports.getK1 = function (input) {
  var client_type =         input.client_type,
      is_multidrive =       input.is_multidrive,
      group =               input.group,
      region =              input.region,
      franchise =           input.franchise,
      ds_restrict =         input.ds_restrict,
      driver_ages =         input.driver_ages,
      driver_expreriences = input.driver_expreriences,
      driver_max_coef = 0,
      experience,
      age,
      driver,
      K1,
      i;

      for (i = 0; i < driver_ages.length; i++) {
        age = driver_ages[i];
        experience = driver_expreriences[i];

        if (typeof age === "number" && age > 18 && typeof experience === "number") {
          driver = new Driver(age, experience, region);
          if (driver_max_coef < driver.getCoefficient()) {
            driver_max_coef = driver.getCoefficient();
          }
        }
      }

      // Судя по всему это условие никогда не будет выполняться,
      // но оно скопировано из Экселя на всякий случай
      if (
          /физическое лицо/i.test(client_type) === false ||
          group == 14 ||
          (
            group != 11 &&
            (
              driver_max_coef >= 1.4 && franchise == 3 ||
              driver_max_coef >= 1.1 && driver_max_coef <= 1.3 && franchise == 2
            )
          )
      ) {
        K1 = 1;
      } else {
        if (is_multidrive) {
          if (ds_restrict) {
            K1 = 1;
          } else {
            K1 = 1.5;
          }
        } else {
          K1 = driver_max_coef;
        }
      }

      return K1;
};

exports.getK1d = function (input) {
  var client_type =         input.client_type,
      is_multidrive =       input.is_multidrive,
      group =               input.group,
      region =              input.region,
      franchise =           input.franchise,
      drivers_num =         input.drivers_num,
      driver_ages =         input.driver_ages,
      driver_expreriences = input.driver_expreriences,
      driver_max_coef = 0,
      experience,
      age,
      driver,
      K1d,
      i;

  var drivers_num_coefficients = {
    "до 3-х включительно": 1,
    "4": 1.02,
    "5": 1.05,
    "6": 1.15,
    "7": 1.32,
    "8 и более": 1.6
  };

      for (i = 0; i < driver_ages.length; i++) {
        age = driver_ages[i];
        experience = driver_expreriences[i];

        if (typeof age === "number" && age > 18 && typeof experience === "number") {
          driver = new Driver(age, experience, region);
          if (driver_max_coef < driver.getCoefficient()) {
            driver_max_coef = driver.getCoefficient();
          }
        }
      }

      // Судя по всему это условие никогда не будет выполняться,
      // но оно скопировано из Экселя на всякий случай
      if (
          /физическое лицо/i.test(client_type) === false ||
          group == 11 ||
          is_multidrive ||
          (
            group != 11 &&
            (
              driver_max_coef >= 1.4 && franchise == 3 ||
              driver_max_coef >= 1.1 && driver_max_coef <= 1.3 && franchise == 2
            )
          )
      ) {
        K1d = 1;
      } else {
        K1d = drivers_num_coefficients[drivers_num];
      }

      return K1d;
};

exports.getK3 = function (input) {
  var installments = input.installments,
      period =       input.period,
      K3;

  var period_coefficients = {
    "6 мес": 0.7,
    "до 7 мес": 0.75,
    "до 8 мес": 0.8,
    "до 9 мес": 0.9,
    "до 10 мес": 0.95,
    "от 10 мес": 1,
    "1 год": 1
  };

  // Это условие не должно выполняться, так как период захардкоден
  // и равен "1 год", но мы все равно его включаем, чтобы быть последовательными:
  // в случаях, когда не так очевидно, что условие лишнее, мы копируем всю логику,
  // также мы поступаем и здесь.
  if (/единовременно/i.test(installments) === false && /1 год/i.test(period) === false) {
    K3 = 0;
  } else {
    K3 = period_coefficients[period];
  }

  return K3;
};


exports.getK4 = function (input) {
  var group =       input.group,
      franchise =   input.franchise,
      client_type = input.client_type,
      bank =        input.bank,
      is_dynamic =  false,
      K4;

  var franchise_coefficients = {
    1: {
      0: 1,
      5000: 0.92,
      10000: 0.85,
      15000: 0.78,
      20000: 0.75,
      25000: 0.73,
      30000: 0.69
    },
    2: {
      0: 1,
      5000: 0.95,
      10000: 0.9,
      15000: 0.85,
      20000: 0.78,
      25000: 0.75,
      30000: 0.71
    },
    3: {
      0: 1,
      5000: 0.97,
      10000: 0.94,
      15000: 0.9,
      20000: 0.85,
      25000: 0.82,
      30000: 0.79
    }
  };

  K4 = franchise_coefficients[group][franchise];

  // always false
  if (is_dynamic && bank === "" &&  /физическое лицо/i.test(client_type)) {
    K4 = K4 * 0.85;
  }

  return K4;
};

exports.getKp = function (input) {
  var region = input.region,
      group = input.group;

  // Внимание! список неполный.
  // TODO: дозаполнить таблицу ''базовые тарифы'!A145:D217
  var region_coefficients = {
    "Санкт-Петербург и область": [1, 1, 1],
    "Москва и МО": [1, 1, 1],
    "Нижегородская область": [1.12, 1.12, 1.12],
    "Пермский край": [1.03, 1.03, 1.1],
    "Ульяновская область": [1.03, 1.03, 1.1],
    "Тюменская область": [0.91, 0.91, 0.91]
  };

  if (!region_coefficients[region]) {
    throw "Invalid region";
  }

  return region_coefficients[region][group - 1];
};

exports.getKc = function (input) {
  var installments = input.installments,
      discount_kv =  input.discount_kv;

  return /единовременно/i.test(installments) ? 1 - discount_kv / 100 : 1;
};

exports.getKap = function (input) {
  var region = input.region,
      mark =   input.mark,
      model =  input.model,
      key = region + ' ' + mark + ' ' + model;

  // Внимание! список неполный
  // TODO: дозаполнить таблицу 'Кар!A2:B1000
  var coefficients = {
    "Москва и МО Toyota Auris": 1.12,
    "Москва и МО Toyota Avensis": 1.32,
    "Москва и МО Toyota Camry": 1.4,
    "Москва и МО Toyota Corolla": 1.28,
    "Москва и МО Toyota Highlander": 0.8,
    "Москва и МО Toyota Hilux": 1.19,
    "Москва и МО Toyota Land Cruiser 150 Prado": 1.05,
    "Москва и МО Toyota Land Cruiser 200": 1.08,
    "Москва и МО Toyota RAV 4": 1.18,
    "Москва и МО Toyota Verso": 1.31,
    "Санкт-Петербург и область Toyota Auris": 1.18,
    "Санкт-Петербург и область Toyota Avensis": 1.29,
    "Санкт-Петербург и область Toyota Camry": 1.71,
    "Санкт-Петербург и область Toyota Corolla": 1.13,
    "Санкт-Петербург и область Toyota Highlander": 1.26,
    "Санкт-Петербург и область Toyota Hilux": 1.26,
    "Санкт-Петербург и область Toyota Land Cruiser 150 Prado": 1.69,
    "Санкт-Петербург и область Toyota Land Cruiser 200": 1.6,
    "Санкт-Петербург и область Toyota RAV 4": 1.42,
    "Санкт-Петербург и область Toyota Venza": 1.08,
    "Санкт-Петербург и область Toyota Verso": 1.42,
    "Тюменская область Toyota Auris": 1.11,
    "Тюменская область Toyota Avensis": 1.34,
    "Тюменская область Toyota Camry": 1.37,
    "Тюменская область Toyota Corolla": 1.18,
    "Тюменская область Toyota Highlander": 0.93,
    "Тюменская область Toyota Hilux": 1.08,
    "Тюменская область Toyota Land Cruiser 150 Prado": 0.9,
    "Тюменская область Toyota Land Cruiser 200": 0.83,
    "Тюменская область Toyota RAV 4": 1.1,
    "Тюменская область Toyota Verso": 1.19
  };

  return coefficients[key] ? coefficients[key] : 1;
};

exports.getKpc = function (input) {
  var installments = input.installments,
      Kpc;

  if (/единовременно/i.test(installments)) {
    Kpc = 1;
  } else if (/2 платежа/i.test(installments)) {
    Kpc = 1.03;
  } else if (/3 платежа/i.test(installments)) {
    Kpc = 1.05;
  } else if (/2 платежа \(6 месяцев\)/i.test(installments)) {
    Kpc = 1.05;
  } else {
    throw "Invalid installments value";
  }

  return Kpc;
};

exports.getKb = function (input) {
  var bank =        input.bank,
      client_type = input.client_type,
      region =      input.region,
      Kb;

  var bank_coefficients = {
    Moscow: {
      "РГС Банк": 1
    },
    Spb: {
      "РГС Банк": 1
    },
    Other: {
      "РГС Банк": 1
    }
  };

  var no_bank_coefficients = {
    Moscow: 1.05,
    Spb: 1.1,
    Other: 1.05
  };

  if (/москва/i.test(region)) {
    region = "Moscow";
  } else if (/санкт-петербург/i.test(region)) {
    region = "Spb";
  } else {
    region = "Other";
  }


  if (bank === "" || /физическое лицо/i.test(client_type) === false) {
    Kb = 1;
  } else {
    Kb = bank_coefficients[region][bank];
    if (Kb === undefined) {
      Kb = no_bank_coefficients[region];
    }
  }

  return Kb;
};

exports.getKprogram = function (input) {
  var region = input.region,
      action = input.action,
      with_pss = !input.no_pss,
      model =  input.model;

  // TODO: дозаполнить таблицу 'базовые тарифы'!I145:V600
  var coefficients = {
    "Москва и МО": {
      // action
      1: {
        // with_pss
        0: {
          "Auris": 1.05,
          "Avensis": 1.04,
          "Camry": 2.55,
          "Corolla": 1.05,
          "Highlander": 2.53,
          "Land Cruiser 150 Prado": 2.55,
          "Land Cruiser 200": 2.53,
          "RAV 4": 1.03,
          "Verso": 1.05,
          "GT86": 1.02,
          "Hilux": 1.03,
          "Prius": 1.02,
          "Venza": 1.02
        },
        1: {
          "Auris": 1.05,
          "Avensis": 1.04,
          "Camry": 1.02,
          "Corolla": 1.05,
          "Highlander": 1.01,
          "Land Cruiser 150 Prado": 1.02,
          "Land Cruiser 200": 1.01,
          "RAV 4": 1.03,
          "Verso": 1.05,
          "GT86": 1.02,
          "Hilux": 1.03,
          "Prius": 1.02,
          "Venza": 1.02
        }
      },
      2: {
        // with_pss
        0: {
          "Auris": 1.07,
          "Avensis": 1.06,
          "Camry": 2.59,
          "Corolla": 1.07,
          "Highlander": 2.59,
          "Land Cruiser 150 Prado": 2.59,
          "Land Cruiser 200": 2.57,
          "RAV 4": 1.05,
          "Verso": 1.07,
          "GT86": 1.04,
          "Hilux": 1.05,
          "Prius": 1.04,
          "Venza": 1.04
        },
        1: {
          "Auris": 1.07,
          "Avensis": 1.06,
          "Camry": 1.04,
          "Corolla": 1.07,
          "Highlander": 1.03,
          "Land Cruiser 150 Prado": 1.04,
          "Land Cruiser 200": 1.03,
          "RAV 4": 1.05,
          "Verso": 1.07,
          "GT86": 1.04,
          "Hilux": 1.05,
          "Prius": 1.04,
          "Venza": 1.04
        }
      },
      3: {
        // with_pss
        0: {
          "Auris": 1.27,
          "Avensis": 1.26,
          "Camry": 3.09,
          "Corolla": 1.27,
          "Highlander": 3.09,
          "Land Cruiser 150 Prado": 3.09,
          "Land Cruiser 200": 3.07,
          "RAV 4": 1.25,
          "Verso": 1.27,
          "GT86": 1.24,
          "Hilux": 1.25,
          "Prius": 1.24,
          "Venza": 1.24
        },
        1: {
          "Auris": 1.27,
          "Avensis": 1.26,
          "Camry": 1.24,
          "Corolla": 1.27,
          "Highlander": 1.23,
          "Land Cruiser 150 Prado": 1.24,
          "Land Cruiser 200": 1.23,
          "RAV 4": 1.25,
          "Verso": 1.27,
          "GT86": 1.24,
          "Hilux": 1.23,
          "Prius": 1.24,
          "Venza": 1.24
        }
      }
    },
    "Санкт-Петербург и область": {
      // action
      1: {
        // with_pss
        0: {
          "Auris": 1.05,
          "Avensis": 1.04,
          "Camry": 2.55,
          "Corolla": 1.05,
          "Highlander": 2.53,
          "Land Cruiser 150 Prado": 2.55,
          "Land Cruiser 200": 2.53,
          "RAV 4": 1.03,
          "Verso": 1.05,
          "GT86": 1.02,
          "Hilux": 1.03,
          "Prius": 1.02,
          "Venza": 1.02
        },
        1: {
          "Auris": 1.05,
          "Avensis": 1.04,
          "Camry": 1.02,
          "Corolla": 1.05,
          "Highlander": 1.01,
          "Land Cruiser 150 Prado": 1.02,
          "Land Cruiser 200": 1.01,
          "RAV 4": 1.03,
          "Verso": 1.05,
          "GT86": 1.02,
          "Hilux": 1.03,
          "Prius": 1.02,
          "Venza": 1.02
        }
      },
      // action
      2: {
        // with_pss
        0: {
          "Auris": 1.07,
          "Avensis": 1.06,
          "Camry": 2.59,
          "Corolla": 1.07,
          "Highlander": 2.59,
          "Land Cruiser 150 Prado": 2.59,
          "Land Cruiser 200": 2.57,
          "RAV 4": 1.05,
          "Verso": 1.07,
          "GT86": 1.04,
          "Hilux": 1.05,
          "Prius": 1.04,
          "Venza": 1.04
        },
        1: {
          "Auris": 1.07,
          "Avensis": 1.06,
          "Camry": 1.04,
          "Corolla": 1.07,
          "Highlander": 1.03,
          "Land Cruiser 150 Prado": 1.04,
          "Land Cruiser 200": 1.03,
          "RAV 4": 1.05,
          "Verso": 1.07,
          "GT86": 1.04,
          "Hilux": 1.05,
          "Prius": 1.04,
          "Venza": 1.04
        }
      },
      // action
      3: {
        // with_pss
        0: {
          "Auris": 1.27,
          "Avensis": 1.26,
          "Camry": 3.09,
          "Corolla": 1.27,
          "Highlander": 3.09,
          "Land Cruiser 150 Prado": 3.09,
          "Land Cruiser 200": 3.07,
          "RAV 4": 1.25,
          "Verso": 1.27,
          "GT86": 1.24,
          "Hilux": 1.25,
          "Prius": 1.24,
          "Venza": 1.24
        },
        1: {
          "Auris": 1.27,
          "Avensis": 1.26,
          "Camry": 1.24,
          "Corolla": 1.27,
          "Highlander": 1.23,
          "Land Cruiser 150 Prado": 1.24,
          "Land Cruiser 200": 1.23,
          "RAV 4": 1.25,
          "Verso": 1.27,
          "GT86": 1.24,
          "Hilux": 1.25,
          "Prius": 1.24,
          "Venza": 1.24
        }
      },
    },
    "Тюменская область": {
      // action
      1: {
        // with_pss
        0: {
          "Auris": 1.05,
          "Avensis": 1.04,
          "Camry": 1.02,
          "Corolla": 1.05,
          "Highlander": 1.01,
          "Land Cruiser 150 Prado": 2.55,
          "Land Cruiser 200": 2.53,
          "RAV 4": 1.03,
          "Verso": 1.05,
          "GT86": 1.02,
          "Hilux": 1.03,
          "Prius": 1.02,
          "Venza": 1.02
        },
        1: {
          "Auris": 1.05,
          "Avensis": 1.04,
          "Camry": 1.02,
          "Corolla": 1.05,
          "Highlander": 1.01,
          "Land Cruiser 150 Prado": 1.02,
          "Land Cruiser 200": 1.01,
          "RAV 4": 1.03,
          "Verso": 1.05,
          "GT86": 1.02,
          "Hilux": 1.03,
          "Prius": 1.02,
          "Venza": 1.02
        }
      },
      // action
      2: {
        // with_pss
        0: {
          "Auris": 1.07,
          "Avensis": 1.06,
          "Camry": 1.04,
          "Corolla": 1.07,
          "Highlander": 1.03,
          "Land Cruiser 150 Prado": 2.59,
          "Land Cruiser 200": 2.57,
          "RAV 4": 1.05,
          "Verso": 1.07,
          "GT86": 1.04,
          "Hilux": 1.05,
          "Prius": 1.04,
          "Venza": 1.04
        },
        1: {
          "Auris": 1.07,
          "Avensis": 1.06,
          "Camry": 1.04,
          "Corolla": 1.07,
          "Highlander": 1.03,
          "Land Cruiser 150 Prado": 1.04,
          "Land Cruiser 200": 1.03,
          "RAV 4": 1.05,
          "Verso": 1.07,
          "GT86": 1.04,
          "Hilux": 1.05,
          "Prius": 1.04,
          "Venza": 1.04
        }
      },
      // action
      3: {
        // with_pss
        0: {
          "Auris": 1.27,
          "Avensis": 1.26,
          "Camry": 1.24,
          "Corolla": 1.27,
          "Highlander": 1.23,
          "Land Cruiser 150 Prado": 3.09,
          "Land Cruiser 200": 3.07,
          "RAV 4": 1.25,
          "Verso": 1.27,
          "GT86": 1.24,
          "Hilux": 1.25,
          "Prius": 1.24,
          "Venza": 1.24
        },
        1: {
          "Auris": 1.27,
          "Avensis": 1.26,
          "Camry": 1.24,
          "Corolla": 1.27,
          "Highlander": 1.23,
          "Land Cruiser 150 Prado": 1.24,
          "Land Cruiser 200": 1.23,
          "RAV 4": 1.25,
          "Verso": 1.27,
          "GT86": 1.24,
          "Hilux": 1.25,
          "Prius": 1.24,
          "Venza": 1.24
        }
      }
    }
  };

  return coefficients[region][action][with_pss ? 1 : 0][model];
};
