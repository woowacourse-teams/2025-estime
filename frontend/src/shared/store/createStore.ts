type Listener = () => void;

type createStoreReturns<T> = {
  getSnapshot: () => T;
  subscribe: (listener: Listener) => () => void;
  setState: (next: T | ((prev: T) => T)) => void;
};

const createStore = <T>(initial: T): createStoreReturns<T> => {
  let state = initial;
  let listen: Listener[] = [];

  const getSnapshot = () => state;

  const subscribe = (listener: Listener) => {
    listen.push(listener);
    return () => {
      listen = listen.filter((li) => li !== listener);
    };
  };

  const publish = () => {
    listen.forEach((listener) => {
      listener();
    });
  };

  const setState = (next: T | ((prev: T) => T)) => {
    state = typeof next === 'function' ? (next as (prev: T) => T)(state) : next;
    publish();
  };

  return {
    getSnapshot,
    subscribe,
    setState,
  };
};

export default createStore;
