import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function canCheckForUpdates({ hasGitBinary, hasGitDirectory }) {
  return hasGitBinary && hasGitDirectory;
}

export function shouldInstallDependencies({ gitUpdated, hasNodeModules, hasPackageJson }) {
  return gitUpdated || (hasPackageJson && !hasNodeModules);
}

export function didGitRevisionChange({ previousRevision, currentRevision }) {
  return Boolean(previousRevision && currentRevision && previousRevision !== currentRevision);
}

export function getOpenCommand(url, platform) {
  if (platform === 'darwin') {
    return { command: 'open', args: [url] };
  }

  if (platform === 'win32') {
    return { command: 'cmd', args: ['/c', 'start', '', url] };
  }

  return { command: 'xdg-open', args: [url] };
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    stdio: options.stdio ?? 'inherit',
    env: process.env
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function tryRunCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    stdio: 'ignore',
    env: process.env
  });

  return result.status === 0;
}

function getGitRevision(cwd) {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd,
    stdio: ['ignore', 'pipe', 'ignore'],
    env: process.env,
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout.trim();
}

async function main() {
  const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
  const hasGitDirectory = existsSync(path.join(repoRoot, '.git'));
  const hasPackageJson = existsSync(path.join(repoRoot, 'package.json'));
  const hasNodeModules = existsSync(path.join(repoRoot, 'node_modules'));
  const hasGitBinary = tryRunCommand('git', ['--version'], { cwd: repoRoot });
  const updateEnabled = canCheckForUpdates({ hasGitBinary, hasGitDirectory });
  const previousGitRevision = updateEnabled ? getGitRevision(repoRoot) : null;
  let gitUpdated = false;

  if (updateEnabled) {
    try {
      runCommand('git', ['pull', '--ff-only'], { cwd: repoRoot });
      gitUpdated = didGitRevisionChange({
        previousRevision: previousGitRevision,
        currentRevision: getGitRevision(repoRoot)
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Skipping automatic update: ${message}`);
    }
  }

  if (shouldInstallDependencies({ gitUpdated, hasNodeModules, hasPackageJson })) {
    runCommand(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'], { cwd: repoRoot });
  }

  runCommand(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { cwd: repoRoot });

  const { startServer } = await import(pathToFileURL(path.join(repoRoot, 'dist', 'src', 'server.js')).href);
  const requestedPort = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : undefined;
  const runningServer = await startServer(Number.isNaN(requestedPort) ? {} : { port: requestedPort });

  console.log(`Canvas API Console is running at ${runningServer.url}`);

  try {
    const openCommand = getOpenCommand(runningServer.url, process.platform);
    runCommand(openCommand.command, openCommand.args, { cwd: repoRoot, stdio: 'ignore' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Unable to open a browser automatically: ${message}`);
    console.warn(`Open this URL manually: ${runningServer.url}`);
  }

  const shutdown = async () => {
    await runningServer.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  await new Promise(() => {});
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to launch Canvas API Console: ${message}`);
    process.exitCode = 1;
  });
}
