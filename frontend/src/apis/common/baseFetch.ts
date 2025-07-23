import { HTTPMethod, QueryParams } from './type';

const BASE_URL = process.env.API_BASE_URL;
// const BASE_URL = 'http://localhost:8080';

interface baseFetchProps {
  path: string;
  method: HTTPMethod;
  query?: QueryParams;
  body?: Record<string, any>;
}

interface ApiResponse<T> {
  code: number;
  message: string | null;
  success: boolean;
  data: T;
}

interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}

const baseFetch = async <T>({ path, method, query, body }: baseFetchProps): Promise<T> => {
  const url = new URL(path, BASE_URL);

  if (query) {
    url.search = new URLSearchParams(
      Object.entries(query).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();
  }

  const options: RequestInit = {
    method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...(body && method !== 'GET' && method !== 'DELETE' ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();
    throw new Error(error.error || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }

  const responseJson: ApiResponse<T> = await response.json();
  return responseJson.data;
};

export default baseFetch;
