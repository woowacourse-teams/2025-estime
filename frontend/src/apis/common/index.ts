import baseFetch from './baseFetch';
import { QueryParams } from './type';

const api = {
  get: <T>(path: string, query?: QueryParams) => baseFetch<T>({ path, method: 'GET', query }),
  post: <T, K>(path: string, body?: K, query?: QueryParams) =>
    baseFetch<T, K>({ path, method: 'POST', query, body }),
  put: <T, K>(path: string, body?: K, query?: QueryParams) =>
    baseFetch<T, K>({ path, method: 'PUT', query, body }),
  patch: <T, K>(path: string, body?: K, query?: QueryParams) =>
    baseFetch<T, K>({ path, method: 'PATCH', query, body }),
  delete: <T>(path: string, query?: QueryParams) => baseFetch<T>({ path, method: 'DELETE', query }),
};

export default api;
