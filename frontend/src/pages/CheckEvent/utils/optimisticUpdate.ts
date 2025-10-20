type tempStore<T> = {
  getSnapshot: () => T;
  setState: (next: T | ((prev: T) => T)) => void;
};

export function addOptimisticUpdate<T>(store: tempStore<T>, updater: (prev: T) => T): T {
  const prevSnapshot = store.getSnapshot();
  store.setState(updater);
  return prevSnapshot;
}

export function rollbackOptimisticUpdate<T>(store: tempStore<T>, prevSnapshot: T): void {
  store.setState(prevSnapshot);
}
