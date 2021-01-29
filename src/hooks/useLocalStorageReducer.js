import { useEffect, useReducer } from 'react';

const baseKey = 'ecommerce';

function remove({ blacklist, state }) {
  return Object.keys(state).reduce((obj, current) => {
    if (!blacklist.includes(current)) {
      obj[current] = state[current];
    }
    return obj;
  }, {});
}

export default function useLocalStorageReducer(key, reducer, initialState, init = null, config = {}) {
  const { blacklist = [] } = config;

  const [state, dispatch] = useReducer(reducer, initialState, defaultState => {
    const item = localStorage.getItem(`${baseKey}/${key}`);
    const persisted = item ? JSON.parse(item) : defaultState;

    if (persisted !== null) {
      return persisted;
    }
    if (init !== null) {
      return init(defaultState);
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(`${baseKey}/${key}`, JSON.stringify(remove({ blacklist, state })));
  }, [state, key, blacklist]);

  return [state, dispatch];
}
