import baseFetch from './baseFetch';
import { QueryParams, RequestBody } from './type';

const api = {
  get: <T>(path: string, query?: QueryParams) => baseFetch<T>(path, 'GET', query),
  post: <T>(path: string, body?: RequestBody, query?: QueryParams) =>
    baseFetch<T>(path, 'POST', query, body),
  put: <T>(path: string, body?: RequestBody, query?: QueryParams) =>
    baseFetch<T>(path, 'PUT', query, body),
  patch: <T>(path: string, body?: RequestBody, query?: QueryParams) =>
    baseFetch<T>(path, 'PATCH', query, body),
  delete: <T>(path: string, query?: QueryParams) => baseFetch<T>(path, 'DELETE', query),
};

export default api;
