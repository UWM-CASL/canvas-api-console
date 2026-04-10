import { afterEach, describe, expect, it, vi } from 'vitest';

import { testCanvasRequest } from '../src/canvas-client.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('testCanvasRequest', () => {
  it('sends a bearer-authenticated Canvas request through the selected host', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: 42, name: 'History 101' }]), {
        headers: { 'content-type': 'application/json' },
        status: 200
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await testCanvasRequest({
      bearerToken: 'test-token-redacted',
      endpoint: '/api/v1/courses',
      method: 'GET',
      profileHost: 'https://canvas.example.edu',
      queryParameters: [{ id: 'param-1', name: 'search_term', value: 'history' }]
    });

    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      'https://canvas.example.edu/api/v1/courses?search_term=history'
    );
    expect(fetchMock.mock.calls[0]?.[1]).toEqual({
        headers: {
          accept: 'application/json',
          authorization: 'Bearer test-token-redacted'
        },
        method: 'GET'
      });
    expect(response).toEqual({
      data: [{ id: 42, name: 'History 101' }],
      ok: true,
      status: 200
    });
  });

  it('requires an https host and a non-empty bearer token', async () => {
    await expect(
      testCanvasRequest({
        bearerToken: '',
        endpoint: '/api/v1/courses',
        method: 'GET',
        profileHost: 'https://canvas.example.edu',
        queryParameters: []
      })
    ).rejects.toThrow('Add a bearer token');

    await expect(
      testCanvasRequest({
        bearerToken: 'test-token-redacted',
        endpoint: '/api/v1/courses',
        method: 'GET',
        profileHost: 'http://canvas.example.edu',
        queryParameters: []
      })
    ).rejects.toThrow('Canvas host must use HTTPS.');
  });

  it('normalizes Canvas API errors without exposing raw request details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ errors: ['The course could not be found.'] }), {
          headers: { 'content-type': 'application/json' },
          status: 404,
          statusText: 'Not Found'
        })
      )
    );

    const response = await testCanvasRequest({
      bearerToken: 'test-token-redacted',
      endpoint: '/api/v1/courses/9999',
      method: 'GET',
      profileHost: 'https://canvas.example.edu',
      queryParameters: []
    });

    expect(response).toEqual({
      error: 'Canvas request failed with status 404 Not Found: The course could not be found.',
      ok: false,
      status: 404
    });
  });
});
