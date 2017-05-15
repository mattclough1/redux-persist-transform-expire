# redux-persist-transform-expire-immutable

[![npm](https://img.shields.io/npm/v/redux-persist-transform-expire.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/redux-persist-transform-expire)

Add expiration to your persisted store.

## Usage

```js
import createExpirationTransform from 'redux-persist-transform-expire-immutable';

const expireTransform = createExpirationTransform({
  expireKey: 'customExpiresAt',
  defaultState: {
    custom: 'values'
  }
});

persistStore(store, {
  transforms: [expireTransform]
});

```
Your expires key should be present in each reducer, which should be expired. E.g.
```
// top most reducer
{
  reducerOne: {
    persistExpiresAt: '2017-04-11T15:46:54.338Z'
  },
  reducerTwo: {
    persistExpiresAt: '2017-04-11T15:46:54.338Z'
  }
}
```


## Configuration

| Attr           | Type    | Default            | Notes                                                           |
| -------------- | ------- | ------------------ | --------------------------------------------------------------- |
| expireKey      | String  | 'persistExpiresAt' | Name of the attribute holding the expire date value             |
| defaultState   | Any     | {}                 | Shape of the state after expirations happen                     |
| deleteOnExpire | Boolean | false              | Removes key from storage instead of setting it to initial state |
