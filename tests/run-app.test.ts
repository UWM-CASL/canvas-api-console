import { describe, expect, it } from 'vitest';

import {
  canCheckForUpdates,
  didGitRevisionChange,
  getNpmCommand,
  getOpenCommand,
  shouldInstallDependencies
} from '../scripts/run-app.mjs';

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

  it('only treats git pull as an update when the checked out revision changes', () => {
    expect(didGitRevisionChange({ previousRevision: 'abc123', currentRevision: 'def456' })).toBe(
      true
    );
    expect(didGitRevisionChange({ previousRevision: 'abc123', currentRevision: 'abc123' })).toBe(
      false
    );
    expect(didGitRevisionChange({ previousRevision: null, currentRevision: 'def456' })).toBe(
      false
    );
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

  it('uses npm in a Windows-compatible way', () => {
    expect(getNpmCommand('win32')).toEqual({
      command: 'npm',
      shell: true
    });
    expect(getNpmCommand('linux')).toEqual({
      command: 'npm',
      shell: false
    });
  });
});
