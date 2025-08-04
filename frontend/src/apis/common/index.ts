import baseFetch from './baseFetch';
import type { QueryParams } from './type';

const api = {
  get: <Res>(path: string, query?: QueryParams) => baseFetch<Res>({ path, method: 'GET', query }),
  post: <Res, Req>(path: string, body?: Req, query?: QueryParams) =>
    baseFetch<Res, Req>({ path, method: 'POST', query, body }),
  put: <Res, Req>(path: string, body?: Req, query?: QueryParams) =>
    baseFetch<Res, Req>({ path, method: 'PUT', query, body }),
  patch: <Res, Req>(path: string, body?: Req, query?: QueryParams) =>
    baseFetch<Res, Req>({ path, method: 'PATCH', query, body }),
  delete: <Res>(path: string, query?: QueryParams) =>
    baseFetch<Res>({ path, method: 'DELETE', query }),
};

export default api;
