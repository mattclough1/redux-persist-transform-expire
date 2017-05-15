/* global describe, it */

var expect = require('expect.js');
var createExpireTransform = require('../index');
var moment = require('moment');
var Map = require('immutable').Map;
var fromJS = require('immutable').fromJS;

describe('Redux persists transform expire', function () {
  it('should do nothing if the state is an empty map', function (done) {
    var state = Map();
    var transform = createExpireTransform();

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(state);

    done();
  });

  it('should return the same if the state doesnt have an expire date prop', function (done) {
    var state = fromJS({
      app: {
        data: [1, 2]
      }
    });

    var transform = createExpireTransform();

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(state);

    done();
  });

  it('should return the same state if it contains an expire prop that is not expired', function (done) {
    var state = fromJS({
      app: {
        reducer: {
          data: {
            values: [1, 2],
            persistExpiresAt: moment().add(1, 'hour').toDate()
          }
        }
      }
    });

    var transform = createExpireTransform();

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(state);

    done();
  });

  it('should return expire a node if it contains an expire prop that is expired', function (done) {
    var state = fromJS({
      app: {
        reducer: {
          data: {
            values: [1, 2],
            persistExpiresAt: moment().subtract(1, 'hour').toDate()
          }
        }
      }
    });

    var transform = createExpireTransform();

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(fromJS({
      app: {
        reducer: {
          data: {

          }
        }
      }
    }));

    done();
  });

  it('should return expire a node if it contains an expire prop that is expired on an array', function (done) {
    var notExpiredDate = moment().add(1, 'hour').toDate();

    var state = fromJS({
      app: {
        reducer: {
          data: [{
            values: [1, 2],
            persistExpiresAt: moment().subtract(1, 'hour').toDate()
          }, {
            values: [5, 6],
            persistExpiresAt: notExpiredDate
          }]
        }
      }
    });

    var transform = createExpireTransform();

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(fromJS({
      app: {
        reducer: {
          data: [{
          },
          {
            values: [5, 6],
            persistExpiresAt: notExpiredDate
          }]
        }
      }
    }));

    done();
  });

  it('should return an empty state if the root element has an expire prop that is expired', function (done) {
    var state = fromJS({
      app: {
        persistExpiresAt: moment().subtract(1, 'hour').toDate(),
        reducer: {
          data: [1, 2]
        }
      }
    });

    var transform = createExpireTransform();

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(fromJS({ app: {} }));

    done();
  });

  it('should ignore the expire prop if it doesnt contain a valid date', function (done) {
    var state = fromJS({
      app: {
        persistExpiresAt: 'invalid-date',
        reducer: {
          data: [1, 2]
        }
      }
    });

    var transform = createExpireTransform();

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(state);

    done();
  });

  it('should allow a user to override the expire prop key', function (done) {
    var state = fromJS({
      app: {
        reducer: {
          data: {
            values: [1, 2],
            myExpireKey: moment().subtract(1, 'hour').toDate()
          }
        }
      }
    });

    var config = {
      expireKey: 'myExpireKey'
    };

    var transform = createExpireTransform(config);

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(fromJS({
      app: {
        reducer: {
          data: {

          }
        }
      }
    }));

    done();
  });

  it('should allow a user to override the default state', function (done) {
    var state = fromJS({
      app: {
        reducer: {
          data: {
            values: [1, 2],
            persistExpiresAt: moment().subtract(1, 'hour').toDate()
          }
        }
      }
    });

    var config = {
      defaultState: {
        values: [3]
      }
    };

    var transform = createExpireTransform(config);

    var inboundOutputState = transform.in(state);
    var outboundOutputState = transform.out(state);

    expect(inboundOutputState).to.eql(state);
    expect(outboundOutputState).to.eql(fromJS({
      app: {
        reducer: {
          data: {
            values: [3]
          }
        }
      }
    }));

    done();
  });
});
