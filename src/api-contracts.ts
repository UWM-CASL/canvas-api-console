export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const

export type HttpMethod = (typeof HTTP_METHODS)[number]

export interface QueryParameter {
  id: string;
  name: string;
  value: string;
}

export interface ServerProfile {
  host: string;
  hasToken: boolean;
  id: string;
  name: string;
}

export interface SaveServerProfile extends ServerProfile {
  token: string;
  tokenAction: 'unchanged' | 'replace' | 'clear';
}

export interface SaveProfilesRequest {
  profiles: SaveServerProfile[];
}

export interface TestNodeRequest {
  endpoint: string;
  method: HttpMethod;
  profileId: string;
  profileHost: string;
  queryParameters: QueryParameter[];
}

export interface CanvasTestRequest extends TestNodeRequest {
  bearerToken: string;
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
