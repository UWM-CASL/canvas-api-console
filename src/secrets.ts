type KeytarModule = typeof import('keytar');

const SERVICE_NAME = 'canvas-api-console';

let cachedKeytarPromise: Promise<KeytarModule> | null = null;

async function getKeytar() {
  if (!cachedKeytarPromise) {
    cachedKeytarPromise = import('keytar')
      .then((module) => ('default' in module ? module.default : module))
      .catch((error: unknown) => {
        cachedKeytarPromise = null;

        const code = error instanceof Error && 'code' in error ? String(error.code) : '';

        if (code === 'ERR_DLOPEN_FAILED') {
          throw new Error('Keychain support is unavailable because the required keytar system libraries are missing. Install the native keytar dependencies for your platform and try again.');
        }

        throw error;
      });
  }

  return cachedKeytarPromise;
}

export async function saveToken(profileId: string, token: string): Promise<void> {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    await deleteToken(profileId);
    return;
  }

  const keytar = await getKeytar();
  await keytar.setPassword(SERVICE_NAME, profileId, trimmedToken);
}

export async function getToken(profileId: string): Promise<string> {
  const keytar = await getKeytar();
  return (await keytar.getPassword(SERVICE_NAME, profileId)) ?? '';
}

export async function deleteToken(profileId: string): Promise<void> {
  const keytar = await getKeytar();
  await keytar.deletePassword(SERVICE_NAME, profileId);
}

export async function hasToken(profileId: string): Promise<boolean> {
  const keytar = await getKeytar();
  return (await keytar.getPassword(SERVICE_NAME, profileId)) !== null;
}

export async function listTokenProfileIds(): Promise<string[]> {
  const keytar = await getKeytar();
  const credentials = await keytar.findCredentials(SERVICE_NAME);
  return credentials.map((credential: { account: string }) => credential.account);
}
