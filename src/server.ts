import { readFileSync } from 'node:fs';
import { once } from 'node:events';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import { renderApp } from './app.js';
import { testCanvasRequest } from './canvas-client.js';
import { DEFAULT_PORT } from './config.js';

const browserScript = readFileSync(new URL('./browser-app.js', import.meta.url), 'utf8');
const browserStyles = readFileSync(new URL('./browser-app.css', import.meta.url), 'utf8');
const MAX_REQUEST_BODY_BYTES = 256 * 1024;

export interface StartServerOptions {
  port?: number;
}

export interface RunningServer {
  close: () => Promise<void>;
  port: number;
  url: string;
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let totalLength = 0;

  for await (const chunk of request) {
    const chunkBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalLength += chunkBuffer.length;

    if (totalLength > MAX_REQUEST_BODY_BYTES) {
      throw new Error('Request body is too large.');
    }

    chunks.push(chunkBuffer);
  }

  if (chunks.length === 0) {
    throw new Error('Request body is required.');
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  response.end(JSON.stringify(payload));
}

function sendText(response: ServerResponse, statusCode: number, body: string, contentType: string): void {
  response.writeHead(statusCode, {
    'content-type': `${contentType}; charset=utf-8`,
    'cache-control': 'no-store'
  });
  response.end(body);
}

async function routeRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const method = request.method ?? 'GET';
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;

  if (method === 'GET' && pathname === '/') {
    sendText(response, 200, renderApp(), 'text/html');
    return;
  }

  if (method === 'GET' && pathname === '/assets/browser-app.js') {
    sendText(response, 200, browserScript, 'text/javascript');
    return;
  }

  if (method === 'GET' && pathname === '/assets/browser-app.css') {
    sendText(response, 200, browserStyles, 'text/css');
    return;
  }

  if (method === 'POST' && pathname === '/api/test-node') {
    try {
      const requestBody = await readJsonBody(request);
      const result = await testCanvasRequest(requestBody as Parameters<typeof testCanvasRequest>[0]);
      sendJson(response, result.ok ? 200 : 400, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to test the node.';
      sendJson(response, 400, {
        error: message,
        ok: false,
        status: 400
      });
    }
    return;
  }

  sendText(response, 404, 'Not found', 'text/plain');
}

export async function startServer(options: StartServerOptions = {}): Promise<RunningServer> {
  const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    void routeRequest(request, response).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'The local server failed to process the request.';
      sendJson(response, 500, {
        error: message,
        ok: false,
        status: 500
      });
    });
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
        server.close((error?: Error) => {
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
