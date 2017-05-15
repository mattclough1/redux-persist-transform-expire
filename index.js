var reduxPersist = require('redux-persist');
var traverse = require('traverse');
var Map = require('immutable').Map;

var PERSIST_EXPIRE_DEFAULT_KEY = 'persistExpiresAt';

function dateToUnix (date) {
  return +(date.getTime() / 1000).toFixed(0);
}

module.exports = function (config) {
  config = config || {};
  config.expireKey = config.expireKey || PERSIST_EXPIRE_DEFAULT_KEY;
  config.defaultState = config.defaultState || config.deleteOnExpire ? null : Map();

  function inbound(state) {
    if (!state) return state;

    return state;
  }

  function outbound(state) {
    if (!state) return state;

    if (state.get(config.expireKey) === 'undefined') {
      return;
    }

    var expireDate = state.get(config.expireKey);

    if (!expireDate) {
        return;
    }

    if (dateToUnix(new Date(expireDate)) < dateToUnix(new Date())) {
      return config.defaultState;
    }

    return state;
  }

  return reduxPersist.createTransform(inbound, outbound);
};
