import { ACTION_TYPE } from "../constants/index.js";
import reducer from "../reducer/index.js";

const createStore = (reducer) => {
  let state = {
    lottos: [],
    winningNumber: { numbers: [], bonusNumber: 0 },
  };

  let listeners = {
    [ACTION_TYPE.LOTTOS.ADDED]: [],
    [ACTION_TYPE.WINNING_NUMBERS.SET]: [],
    [ACTION_TYPE.CLEAR]: [],
  };

  const getState = () => {
    return { ...state };
  };

  const dispatch = (action) => {
    state = reducer(state, action);

    listeners[action.type].forEach((listener) => listener());
  };

  const subscribe = (actionType, listener) => {
    listeners[actionType].push(listener);
  };

  return { getState, dispatch, subscribe };
};

const store = createStore(reducer);

export default store;
