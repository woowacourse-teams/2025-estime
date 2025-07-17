// 공통 타입 정의
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestBody = Record<string, any>;

export type QueryParams = {
  [key: string]: string | number | boolean | undefined;
};
