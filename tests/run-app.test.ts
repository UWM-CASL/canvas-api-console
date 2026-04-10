import { describe, expect, it } from 'vitest';

import { canCheckForUpdates, getOpenCommand, shouldInstallDependencies } from '../scripts/run-app.mjs';

describe('run-app helpers', () => {
  it('only enables update checks for git checkouts with git installed', () => {
    expect(canCheckForUpdates({ hasGitBinary: true, hasGitDirectory: true })).toBe(true);
    expect(canCheckForUpdates({ hasGitBinary: false, hasGitDirectory: true })).toBe(false);
    expect(canCheckForUpdates({ hasGitBinary: true, hasGitDirectory: false })).toBe(false);
  });

  it('installs dependencies on first run or after a successful update', () => {
    expect(
      shouldInstallDependencies({ gitUpdated: false, hasNodeModules: false, hasPackageJson: true })
    ).toBe(true);
    expect(
      shouldInstallDependencies({ gitUpdated: true, hasNodeModules: true, hasPackageJson: true })
    ).toBe(true);
    expect(
      shouldInstallDependencies({ gitUpdated: false, hasNodeModules: true, hasPackageJson: true })
    ).toBe(false);
  });

  it('uses platform-appropriate browser commands', () => {
    expect(getOpenCommand('http://127.0.0.1:3210/', 'darwin')).toEqual({
      command: 'open',
      args: ['http://127.0.0.1:3210/']
    });
    expect(getOpenCommand('http://127.0.0.1:3210/', 'win32')).toEqual({
      command: 'cmd',
      args: ['/c', 'start', '', 'http://127.0.0.1:3210/']
    });
    expect(getOpenCommand('http://127.0.0.1:3210/', 'linux')).toEqual({
      command: 'xdg-open',
      args: ['http://127.0.0.1:3210/']
    });
  });
});
