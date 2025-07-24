import { useLocation } from 'react-router';

type QueryParamResult<T extends string | string[]> = T extends string
  ? string
  : Record<string, string | null>;

export const useExtractQueryParams = <T extends string | string[]>(
  keys: T
): QueryParamResult<T> => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  if (typeof keys === 'string') {
    const value = params.get(keys);
    if (value === null) throw new Error('key 값이 null 입니다.');
    return value as QueryParamResult<T>;
  }

  const result = keys.reduce(
    (acc, key) => {
      const value = params.get(key);
      if (value === null) throw new Error('key 값이 null 입니다.');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return result as QueryParamResult<T>;
};
