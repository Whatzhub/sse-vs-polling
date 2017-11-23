const Helpers = {};

Helpers.randomNumber = function(min, max) {
  return Math.round(Math.floor(Math.random() * (max - min)) + min);
}

module.exports = Helpers;