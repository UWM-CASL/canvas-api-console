import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

import { deleteToken, getToken, listTokenProfileIds, saveToken } from './secrets.js';

export interface StoredProfile {
  host: string;
  id: string;
  name: string;
}

export interface SavedProfile extends StoredProfile {
  token: string;
}

interface ProfileFilePayload {
  profiles: StoredProfile[];
  version: 1;
}

function getConfigRoot(): string {
  const configuredRoot = process.env.CANVAS_API_CONSOLE_CONFIG_DIR?.trim();

  if (configuredRoot) {
    return configuredRoot;
  }

  if (process.platform === 'win32') {
    return process.env.APPDATA?.trim() || join(homedir(), 'AppData', 'Roaming');
  }

  if (process.platform === 'darwin') {
    return join(homedir(), 'Library', 'Application Support');
  }

  return process.env.XDG_CONFIG_HOME?.trim() || join(homedir(), '.config');
}

function getProfilesFilePath(): string {
  return join(getConfigRoot(), 'canvas-api-console', 'profiles.json');
}

async function readStoredProfiles(): Promise<StoredProfile[]> {
  try {
    const fileContents = await readFile(getProfilesFilePath(), 'utf8');
    const parsed = JSON.parse(fileContents) as Partial<ProfileFilePayload>;

    if (!Array.isArray(parsed.profiles)) {
      return [];
    }

    return parsed.profiles
      .filter((profile) => profile && typeof profile === 'object')
      .map((profile, index) => ({
        host: typeof profile.host === 'string' ? profile.host : '',
        id: typeof profile.id === 'string' ? profile.id : `profile-${index + 1}`,
        name: typeof profile.name === 'string' ? profile.name : `Server ${index + 1}`
      }));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function writeStoredProfiles(profiles: StoredProfile[]): Promise<void> {
  const filePath = getProfilesFilePath();
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    JSON.stringify(
      {
        profiles,
        version: 1
      } satisfies ProfileFilePayload,
      null,
      2
    ),
    'utf8'
  );
}

export async function loadProfiles(): Promise<SavedProfile[]> {
  const profiles = await readStoredProfiles();

  return Promise.all(
    profiles.map(async (profile) => ({
      ...profile,
      token: await getToken(profile.id)
    }))
  );
}

export async function saveProfiles(profiles: SavedProfile[]): Promise<SavedProfile[]> {
  const existingProfiles = await readStoredProfiles();
  const existingProfileIds = new Set([
    ...existingProfiles.map((profile) => profile.id),
    ...(await listTokenProfileIds())
  ]);
  const storedProfiles = profiles.map(({ token: _token, ...profile }) => ({
    host: profile.host,
    id: profile.id,
    name: profile.name
  }));

  await writeStoredProfiles(storedProfiles);

  for (const profile of profiles) {
    await saveToken(profile.id, profile.token);
  }

  const nextProfileIds = new Set(profiles.map((profile) => profile.id));

  for (const profileId of existingProfileIds) {
    if (!nextProfileIds.has(profileId)) {
      await deleteToken(profileId);
    }
  }

  return loadProfiles();
}
