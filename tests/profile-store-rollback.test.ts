import { join } from 'node:path';

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

describe('profile-store rollback', () => {
  beforeEach(() => {
    tokenStore.clear();
  });

  afterEach(() => {
    delete process.env.CANVAS_API_CONSOLE_CONFIG_DIR;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('restores keychain state when writing profile metadata fails', async () => {
    const realFs = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
    const os = await import('node:os');
    const configDir = await realFs.mkdtemp(join(os.tmpdir(), 'canvas-api-console-'));
    process.env.CANVAS_API_CONSOLE_CONFIG_DIR = configDir;
    let shouldFailWrite = false;

    vi.doMock('node:fs/promises', async () => {
      const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');

      return {
        ...actual,
        writeFile: vi.fn(async (...args: Parameters<typeof actual.writeFile>) => {
          if (shouldFailWrite) {
            throw new Error('disk full');
          }

          return actual.writeFile(...args);
        })
      };
    });

    const { saveProfiles } = await import('../src/profile-store.js');

    await saveProfiles([
      {
        hasToken: false,
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: 'original-token',
        tokenAction: 'replace'
      }
    ]);

    shouldFailWrite = true;

    await expect(
      saveProfiles([
        {
          hasToken: true,
          host: 'https://canvas.example.edu',
          id: 'profile-1',
          name: 'UWM Prod',
          token: 'replacement-token',
          tokenAction: 'replace'
        }
      ])
    ).rejects.toThrow('disk full');

    expect(tokenStore.get('profile-1')).toBe('original-token');

    const savedFile = JSON.parse(
      await realFs.readFile(join(configDir, 'canvas-api-console', 'profiles.json'), 'utf8')
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

    await realFs.rm(configDir, { force: true, recursive: true });
  });
});
