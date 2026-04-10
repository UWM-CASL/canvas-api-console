export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const

export type HttpMethod = (typeof HTTP_METHODS)[number]

export interface QueryParameter {
  id: string;
  name: string;
  value: string;
}

export interface TestNodeRequest {
  bearerToken: string;
  endpoint: string;
  method: HttpMethod;
  profileHost: string;
  queryParameters: QueryParameter[];
}

export type TestNodeResponse =
  | {
      data: unknown;
      ok: true;
      status: number;
    }
  | {
      error: string;
      ok: false;
      status: number;
    };
