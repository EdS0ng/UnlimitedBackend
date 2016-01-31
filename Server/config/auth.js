'use strict';

module.exports = {
  expTime: {num: 7, unit: 'days'},
  refreshToken: false,
  saltRounds: 10,
  validatePassword: function(password) {
    return true;
  },
  validateUsername: function(username) {
    return true;
  },
  adminNames: ["Virsaviya", "ray-kim-12", "paulgoblin", "EdS0ng"]
};
