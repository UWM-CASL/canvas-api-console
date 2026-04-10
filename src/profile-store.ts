import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

import { deleteToken, getToken, hasToken, listTokenProfileIds, saveToken } from './secrets.js';
import {
  normalizeProfileCollection,
  normalizeProfileSaveRecord,
  normalizeStoredProfile,
  type ProfileRecord,
  type ProfileSaveRecord
} from './profile-model.js';

export type StoredProfile = ProfileRecord;

export interface ServerProfileState extends StoredProfile {
  hasToken: boolean;
}

export interface SaveProfileInput extends ServerProfileState, ProfileSaveRecord {}

interface ProfileFilePayload {
  profiles: StoredProfile[];
  version: 1;
}

async function safeHasToken(profileId: string): Promise<boolean> {
  try {
    return await hasToken(profileId);
  } catch {
    return false;
  }
}

async function safeListTokenProfileIds(): Promise<string[]> {
  try {
    return await listTokenProfileIds();
  } catch {
    return [];
  }
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

    return normalizeProfileCollection(
      parsed.profiles
        .filter((profile) => profile && typeof profile === 'object')
        .map((profile, index) => ({
          host: typeof profile.host === 'string' ? profile.host : '',
          id: typeof profile.id === 'string' ? profile.id : `profile-${index + 1}`,
          name: typeof profile.name === 'string' ? profile.name : `Server ${index + 1}`
        }))
    );
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

async function captureTokenSnapshots(profileIds: Iterable<string>): Promise<Map<string, string | null>> {
  const snapshots = new Map<string, string | null>();

  for (const profileId of profileIds) {
    const token = await getToken(profileId);
    snapshots.set(profileId, token || null);
  }

  return snapshots;
}

async function restoreTokenSnapshots(snapshots: Map<string, string | null>): Promise<void> {
  for (const [profileId, token] of snapshots.entries()) {
    if (token) {
      await saveToken(profileId, token);
      continue;
    }

    await deleteToken(profileId);
  }
}

function formatRollbackError(originalError: unknown, rollbackError: unknown): Error {
  const originalMessage = originalError instanceof Error ? originalError.message : String(originalError);
  const rollbackMessage = rollbackError instanceof Error ? rollbackError.message : String(rollbackError);

  return new Error(`${originalMessage} Rollback also failed: ${rollbackMessage}`);
}

async function applyProfileTokenChanges(
  profiles: SaveProfileInput[],
  existingProfileIds: Set<string>
): Promise<void> {
  for (const profile of profiles) {
    if (profile.tokenAction === 'replace') {
      await saveToken(profile.id, profile.token);
      continue;
    }

    if (profile.tokenAction === 'clear') {
      await deleteToken(profile.id);
    }
  }

  const nextProfileIds = new Set(profiles.map((profile) => profile.id));

  for (const profileId of existingProfileIds) {
    if (!nextProfileIds.has(profileId)) {
      await deleteToken(profileId);
    }
  }
}

export async function loadProfiles(): Promise<ServerProfileState[]> {
  const profiles = await readStoredProfiles();

  return Promise.all(
    profiles.map(async (profile) => ({
      ...profile,
      hasToken: await safeHasToken(profile.id)
    }))
  );
}

export async function saveProfiles(profiles: SaveProfileInput[]): Promise<ServerProfileState[]> {
  const normalizedProfiles = normalizeProfileCollection(
    profiles.map((profile) => ({
      ...profile,
      ...normalizeProfileSaveRecord(profile)
    }))
  );
  const existingProfiles = await readStoredProfiles();
  const existingProfileIds = new Set([
    ...existingProfiles.map((profile) => profile.id),
    ...(await safeListTokenProfileIds())
  ]);
  const tokenSnapshots = await captureTokenSnapshots(
    new Set([...existingProfileIds, ...normalizedProfiles.map((profile) => profile.id)])
  );
  const storedProfiles = normalizedProfiles.map((profile) =>
    normalizeStoredProfile({
      host: profile.host,
      id: profile.id,
      name: profile.name
    })
  );

  try {
    await applyProfileTokenChanges(normalizedProfiles, existingProfileIds);
    await writeStoredProfiles(storedProfiles);
  } catch (error: unknown) {
    try {
      await restoreTokenSnapshots(tokenSnapshots);
    } catch (rollbackError: unknown) {
      throw formatRollbackError(error, rollbackError);
    }

    throw error;
  }

  return loadProfiles();
}

export async function getProfileToken(profileId: string): Promise<string> {
  return getToken(profileId);
}

export async function getStoredProfile(profileId: string): Promise<StoredProfile | null> {
  const profiles = await readStoredProfiles();
  return profiles.find((profile) => profile.id === profileId) ?? null;
}
