import { request as httpRequest } from 'node:http';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { getProfileToken, getStoredProfile, loadProfiles, saveProfiles } from '../src/profile-store.js';
import { startServer } from '../src/server.js';

vi.mock('../src/profile-store.js', () => ({
  getStoredProfile: vi.fn(async () => ({
    host: 'https://canvas.example.edu',
    id: 'profile-1',
    name: 'UWM Prod'
  })),
  getProfileToken: vi.fn(async () => 'test-token-redacted'),
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
    expect(scriptResponse.body).toContain('about-section');
    expect(scriptResponse.body).toContain("if (!(target instanceof HTMLElement) && !(target instanceof SVGElement))");
    expect(scriptResponse.body).not.toContain('about-panel');
    expect(scriptResponse.body).not.toContain('about-card');
    expect(styleResponse.status).toBe(200);
    expect(styleResponse.body).toContain('.node-space');
    expect(styleResponse.body).toContain('.about-section');
    expect(styleResponse.body).toContain('.icon-svg');
    expect(styleResponse.body).toContain('pointer-events: none;');
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
        endpoint: '/api/v1/courses/11',
        method: 'GET',
        profileId: 'profile-1',
        queryParameters: []
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    });

    expect(response.status).toBe(200);
    expect(vi.mocked(getProfileToken)).toHaveBeenCalledWith('profile-1');
    expect(JSON.parse(response.body)).toEqual({
      data: { id: 11, name: 'Biology' },
      ok: true,
      status: 200
    });
  });

  it('rejects test-node requests for unknown saved profiles', async () => {
    vi.mocked(getStoredProfile).mockResolvedValueOnce(null);

    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}api/test-node`, {
      body: JSON.stringify({
        endpoint: '/api/v1/courses/11',
        method: 'GET',
        profileId: 'profile-missing',
        queryParameters: []
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    });

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Select a saved server profile before testing a node.',
      ok: false,
      status: 400
    });
  });

  it('loads saved profiles through the local API', async () => {
    vi.mocked(loadProfiles).mockResolvedValueOnce([
      {
        hasToken: true,
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod'
      }
    ]);

    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}api/profiles`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      profiles: [
        {
          hasToken: true,
          host: 'https://canvas.example.edu',
          id: 'profile-1',
          name: 'UWM Prod'
        }
      ]
    });
  });

  it('saves profiles through the local API', async () => {
    vi.mocked(saveProfiles).mockResolvedValueOnce([
      {
        hasToken: true,
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod'
      }
    ]);

    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await makeRequest(`${server.url}api/profiles`, {
      body: JSON.stringify({
        profiles: [
          {
            hasToken: false,
            host: 'https://canvas.example.edu',
            id: 'profile-1',
            name: 'UWM Prod',
            token: 'test-token-redacted',
            tokenAction: 'replace'
          }
        ]
      }),
      headers: { 'content-type': 'application/json' },
      method: 'PUT'
    });

    expect(response.status).toBe(200);
    expect(vi.mocked(saveProfiles)).toHaveBeenCalledWith([
      {
        hasToken: false,
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'test-token-redacted',
        tokenAction: 'replace'
      }
    ]);
    expect(JSON.parse(response.body)).toEqual({
      profiles: [
        {
          hasToken: true,
          host: 'https://canvas.example.edu',
          id: 'profile-1',
          name: 'UWM Prod'
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
      error: 'Profile requests must include a profiles array with id, name, host, token, token state, and token availability fields.',
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
