import { once } from 'node:events';
import { createServer } from 'node:http';

import { renderApp } from './app.js';
import { DEFAULT_PORT } from './config.js';

export interface StartServerOptions {
  port?: number;
}

export interface RunningServer {
  close: () => Promise<void>;
  port: number;
  url: string;
}

export async function startServer(options: StartServerOptions = {}): Promise<RunningServer> {
  const server = createServer((request, response) => {
    if (request.url !== '/') {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(renderApp());
  });

  server.listen(options.port ?? DEFAULT_PORT, '127.0.0.1');
  await once(server, 'listening');

  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('The local server did not expose a TCP port.');
  }

  return {
    port: address.port,
    url: `http://127.0.0.1:${address.port}/`,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  };
}
