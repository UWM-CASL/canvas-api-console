import { pathToFileURL } from 'node:url';

import { startServer } from './server.js';

async function main(): Promise<void> {
  const runningServer = await startServer();
  console.log(`Canvas API Console is running at ${runningServer.url}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to start Canvas API Console: ${message}`);
    process.exitCode = 1;
  });
}
