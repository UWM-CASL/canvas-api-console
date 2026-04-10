import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const tokenStore = new Map<string, string>();

vi.mock('keytar', () => ({
  default: {
    deletePassword: vi.fn(async (_service: string, account: string) => tokenStore.delete(account)),
    findCredentials: vi.fn(async () =>
      Array.from(tokenStore.entries()).map(([account, password]) => ({ account, password }))
    ),
    getPassword: vi.fn(async (_service: string, account: string) => tokenStore.get(account) ?? null),
    setPassword: vi.fn(async (_service: string, account: string, password: string) => {
      tokenStore.set(account, password);
    })
  }
}));

let configDir = '';

describe('profile-store', () => {
  beforeEach(async () => {
    tokenStore.clear();
    configDir = await mkdtemp(join(tmpdir(), 'canvas-api-console-'));
    process.env.CANVAS_API_CONSOLE_CONFIG_DIR = configDir;
  });

  afterEach(async () => {
    delete process.env.CANVAS_API_CONSOLE_CONFIG_DIR;
    await rm(configDir, { force: true, recursive: true });
  });

  it('persists profile metadata to disk and tokens to the keychain', async () => {
    const { loadProfiles, saveProfiles } = await import('../src/profile-store.js');

    await saveProfiles([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'mock-keychain-token'
      }
    ]);

    const savedFile = JSON.parse(
      await readFile(join(configDir, 'canvas-api-console', 'profiles.json'), 'utf8')
    ) as {
      profiles: Array<{ host: string; id: string; name: string }>;
    };

    expect(savedFile.profiles).toEqual([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod'
      }
    ]);
    expect(tokenStore.get('profile-1')).toBe('mock-keychain-token');
    await expect(loadProfiles()).resolves.toEqual([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'mock-keychain-token'
      }
    ]);
  });

  it('removes deleted profile tokens from the keychain', async () => {
    const { saveProfiles } = await import('../src/profile-store.js');

    await saveProfiles([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'mock-keychain-token'
      },
      {
        host: 'https://canvas-test.example.edu',
        id: 'profile-2',
        name: 'UWM Test',
        token: 'second-mock-token'
      }
    ]);

    await saveProfiles([
      {
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: ''
      }
    ]);

    expect(tokenStore.has('profile-1')).toBe(false);
    expect(tokenStore.has('profile-2')).toBe(false);
  });
});
