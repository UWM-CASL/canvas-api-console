import { request as httpRequest } from 'node:http';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadProfiles, saveProfiles } from '../src/profile-store.js';
import { startServer } from '../src/server.js';

vi.mock('../src/profile-store.js', () => ({
  loadProfiles: vi.fn(async () => []),
  saveProfiles: vi.fn(async (profiles) => profiles)
}));

const servers: Array<{ close: () => Promise<void> }> = [];

function makeRequest(url: string, options: { body?: string; headers?: Record<string, string>; method?: string } = {}) {
  return new Promise<{ body: string; status: number }>((resolve, reject) => {
    const request = httpRequest(
      url,
      {
        headers: options.headers,
        method: options.method ?? 'GET'
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        response.on('end', () => {
          resolve({
            body: Buffer.concat(chunks).toString('utf8'),
            status: response.statusCode ?? 0
          });
        });
      }
    );

    request.on('error', reject);

    if (options.body) {
      request.write(options.body);
    }

    request.end();
  });
}

afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  await Promise.all(servers.splice(0).map((server) => server.close()));
});

describe('startServer', () => {
  it('serves the browser UI on the root route', async () => {
    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(server.url);

    expect(response.status).toBe(200);
    expect(response.body).toContain('Canvas API Console');
    expect(response.body).toContain('/assets/browser-app.js');
    expect(response.body).toContain('/assets/browser-app.css');
  });

  it('serves the browser assets for the basic UI shell', async () => {
    const server = await startServer({ port: 0 });
    servers.push(server);

    const [scriptResponse, styleResponse] = await Promise.all([
      makeRequest(`${server.url}assets/browser-app.js`),
      makeRequest(`${server.url}assets/browser-app.css`)
    ]);

    expect(scriptResponse.status).toBe(200);
    expect(scriptResponse.body).toContain('Query Builder');
    expect(styleResponse.status).toBe(200);
    expect(styleResponse.body).toContain('.node-space');
  });

  it('tests Canvas nodes through the local API endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 11, name: 'Biology' }), {
          headers: { 'content-type': 'application/json' },
          status: 200
        })
      )
    );

    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}api/test-node`, {
      body: JSON.stringify({
        bearerToken: 'secret-token',
        endpoint: '/api/v1/courses/11',
        method: 'GET',
        profileHost: 'https://canvas.example.edu',
        queryParameters: []
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    });

    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      data: { id: 11, name: 'Biology' },
      ok: true,
      status: 200
    });
  });

  it('loads saved profiles through the local API', async () => {
    vi.mocked(loadProfiles).mockResolvedValueOnce([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'stored-token'
      }
    ]);

    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}api/profiles`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      profiles: [
        {
          host: 'https://canvas.example.edu',
          id: 'profile-1',
          name: 'UWM Prod',
          token: 'stored-token'
        }
      ]
    });
  });

  it('saves profiles through the local API', async () => {
    vi.mocked(saveProfiles).mockResolvedValueOnce([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'stored-token'
      }
    ]);

    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}api/profiles`, {
      body: JSON.stringify({
        profiles: [
          {
            host: 'https://canvas.example.edu',
            id: 'profile-1',
            name: 'UWM Prod',
            token: 'stored-token'
          }
        ]
      }),
      headers: { 'content-type': 'application/json' },
      method: 'PUT'
    });

    expect(response.status).toBe(200);
    expect(vi.mocked(saveProfiles)).toHaveBeenCalledWith([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'stored-token'
      }
    ]);
    expect(JSON.parse(response.body)).toEqual({
      profiles: [
        {
          host: 'https://canvas.example.edu',
          id: 'profile-1',
          name: 'UWM Prod',
          token: 'stored-token'
        }
      ]
    });
  });

  it('rejects invalid profile save requests', async () => {
    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}api/profiles`, {
      body: JSON.stringify({
        profiles: [{ id: 'profile-1' }]
      }),
      headers: { 'content-type': 'application/json' },
      method: 'PUT'
    });

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Profile requests must include a profiles array with id, name, host, and token fields.',
      ok: false,
      status: 400
    });
  });

  it('returns a 404 for unknown routes', async () => {
    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}missing`);

    expect(response.status).toBe(404);
    expect(response.body).toBe('Not found');
  });
});
