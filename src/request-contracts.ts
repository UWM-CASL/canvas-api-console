import type { HttpMethod, QueryParameter } from './api-contracts.js';

export interface TestNodeRequest {
  endpoint: string;
  method: HttpMethod;
  profileId: string;
  queryParameters: QueryParameter[];
}

export interface CanvasTestRequest {
  bearerToken: string;
  endpoint: string;
  method: HttpMethod;
  profileHost: string;
  queryParameters: QueryParameter[];
}
