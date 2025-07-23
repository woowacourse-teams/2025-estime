import baseFetch from './baseFetch';
import { QueryParams, RequestBody } from './type';

const api = {
  get: <T>(path: string, query?: QueryParams) => baseFetch<T>({ path, method: 'GET', query }),
  post: <T>(path: string, body?: RequestBody, query?: QueryParams) =>
    baseFetch<T>({ path, method: 'POST', query, body }),
  put: <T>(path: string, body?: RequestBody, query?: QueryParams) =>
    baseFetch<T>({ path, method: 'PUT', query, body }),
  patch: <T>(path: string, body?: RequestBody, query?: QueryParams) =>
    baseFetch<T>({ path, method: 'PATCH', query, body }),
  delete: <T>(path: string, query?: QueryParams) => baseFetch<T>({ path, method: 'DELETE', query }),
};

export default api;
