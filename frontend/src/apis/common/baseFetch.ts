import { HTTPMethod, QueryParams } from './type';

// const BASE_URL = import.meta.env.API_URL;
const BASE_URL = 'http://localhost:8080';

const baseFetch = async <T>(
  path: string,
  method: HTTPMethod,
  query?: QueryParams,
  body?: Record<string, any>
): Promise<T> => {
  const searchParams = new URLSearchParams(
    Object.entries({ language: 'ko-KR', ...query }).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>
    )
  );

  const url = `${BASE_URL}${path}?${searchParams.toString()}`;
  const options: RequestInit = {
    method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...(body && method !== 'GET' && method !== 'DELETE' ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }

  return response.json();
};

export default baseFetch;
