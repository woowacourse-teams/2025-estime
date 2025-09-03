import { useLocation } from 'react-router';

type QueryParamResult<T extends string | string[]> = T extends string
  ? string
  : { [K in T[number]]: string | null };

export const useExtractQueryParams = <T extends string | string[]>(
  keys: T
): QueryParamResult<T> => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  if (typeof keys === 'string') {
    const value = params.get(keys);
    return value as QueryParamResult<T>;
  }

  const result = keys.reduce(
    (acc, key) => {
      acc[key as T[number]] = params.get(key);
      return acc;
    },
    {} as { [K in T[number]]: string | null }
  );

  return result as QueryParamResult<T>;
};
