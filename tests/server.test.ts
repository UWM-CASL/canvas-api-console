import { afterEach, describe, expect, it } from 'vitest';

import { startServer } from '../src/server.js';

const servers: Array<{ close: () => Promise<void> }> = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.close()));
});

describe('startServer', () => {
  it('serves the browser UI on the root route', async () => {
    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await fetch(server.url);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('Canvas API Console');
    expect(html).toContain('npm run app');
  });

  it('returns a 404 for unknown routes', async () => {
    const server = await startServer({ port: 0 });
    servers.push(server);

    const response = await fetch(`${server.url}missing`);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Not found');
  });
});
