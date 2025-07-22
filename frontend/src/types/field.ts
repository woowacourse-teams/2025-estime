export type Field<T> = {
  value: T;
  set: (value: T) => void;
};
