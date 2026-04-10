import keytar from 'keytar';

const SERVICE_NAME = 'canvas-api-console';

export async function saveToken(profileId: string, token: string): Promise<void> {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    await deleteToken(profileId);
    return;
  }

  await keytar.setPassword(SERVICE_NAME, profileId, trimmedToken);
}

export async function getToken(profileId: string): Promise<string> {
  return (await keytar.getPassword(SERVICE_NAME, profileId)) ?? '';
}

export async function deleteToken(profileId: string): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, profileId);
}

export async function hasToken(profileId: string): Promise<boolean> {
  return (await keytar.getPassword(SERVICE_NAME, profileId)) !== null;
}

export async function listTokenProfileIds(): Promise<string[]> {
  const credentials = await keytar.findCredentials(SERVICE_NAME);
  return credentials.map((credential) => credential.account);
}
