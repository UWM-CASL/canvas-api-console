import {
  HTTP_METHODS,
  type HttpMethod,
  type QueryParameter,
  type TestNodeResponse
} from './api-contracts.js';
import { normalizeProfileHost } from './profile-model.js';
import type { CanvasTestRequest } from './request-contracts.js';

function normalizeMethod(method: string): HttpMethod {
  const normalizedMethod = method.toUpperCase();

  if (!HTTP_METHODS.includes(normalizedMethod as HttpMethod)) {
    throw new Error('Select a supported HTTP method before testing a node.');
  }

  return normalizedMethod as HttpMethod;
}

function normalizeHost(profileHost: string): URL {
  return new URL(`${normalizeProfileHost(profileHost)}/`);
}

function normalizeEndpoint(endpoint: string): string {
  const trimmedEndpoint = endpoint.trim();

  if (!trimmedEndpoint.startsWith('/')) {
    throw new Error('API endpoints must start with /.');
  }

  return trimmedEndpoint;
}

function appendQueryParameters(url: URL, queryParameters: QueryParameter[]): void {
  for (const queryParameter of queryParameters) {
    const name = queryParameter.name.trim();

    if (!name) {
      continue;
    }

    url.searchParams.set(name, queryParameter.value);
  }
}

function normalizeErrorMessage(status: number, statusText: string, data: unknown): string {
  if (typeof data === 'string' && data.trim()) {
    return `Canvas request failed with status ${status} ${statusText}: ${data.trim()}`;
  }

  if (data && typeof data === 'object' && 'errors' in data && Array.isArray(data.errors)) {
    const details = data.errors
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter(Boolean)
      .join('; ');

    if (details) {
      return `Canvas request failed with status ${status} ${statusText}: ${details}`;
    }
  }

  return `Canvas request failed with status ${status} ${statusText}.`;
}

async function readResponseData(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    return text || null;
  } catch {
    throw new Error('Canvas returned a response that could not be parsed.');
  }
}

export async function testCanvasRequest(request: CanvasTestRequest): Promise<TestNodeResponse> {
  const host = normalizeHost(request.profileHost);
  const endpoint = normalizeEndpoint(request.endpoint);
  const method = normalizeMethod(request.method);
  const bearerToken = request.bearerToken.trim();

  if (!bearerToken) {
    throw new Error('Add a bearer token to the selected server profile before testing a node.');
  }

  const requestUrl = new URL(endpoint, host);
  appendQueryParameters(requestUrl, request.queryParameters);

  try {
    const response = await fetch(requestUrl, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${bearerToken}`
      },
      method
    });
    const data = await readResponseData(response);

    if (!response.ok) {
      return {
        error: normalizeErrorMessage(response.status, response.statusText, data),
        ok: false,
        status: response.status
      };
    }

    return {
      data,
      ok: true,
      status: response.status
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Canvas returned a response that could not be parsed.') {
      return {
        error: error.message,
        ok: false,
        status: 502
      };
    }

    return {
      error: 'Unable to reach the selected Canvas host.',
      ok: false,
      status: 0
    };
  }
}
