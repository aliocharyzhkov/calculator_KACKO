jest.autoMockOff();

var Model = require('../lib/Model');
var model;

describe('Find group by model', function () {
  model = "Land Cruiser 200";
  it(model + '\'s group is 3', function () {
    model = new Model("Toyota", model);
    expect(model.getGroup()).toBe(3);
  });
});
