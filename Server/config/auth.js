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
  adminNames: ["ray-kim-12", "EdS0ng"]
};
