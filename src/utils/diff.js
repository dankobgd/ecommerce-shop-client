import _ from 'lodash';

// returns the deep difference between the base object and the compare target
// diff ({name: 'bob', email: 'bob@bob.com', admin: false}, {name: 'bob', 'newbob@bob.com', admin: true})  -> {email: 'newbob@bob.com', admin: true}

export function diff(base, object) {
  return _.transform(object, (result, value, key) => {
    if (!_.isEqual(value, base[key])) {
      result[key] = _.isObject(value) && _.isObject(base[key]) ? diff(value, base[key]) : value;
    }
  });
}
