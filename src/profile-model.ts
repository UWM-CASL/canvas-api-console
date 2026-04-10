export interface ProfileRecord {
  host: string;
  id: string;
  name: string;
}

export interface ProfileSaveRecord extends ProfileRecord {
  token: string;
  tokenAction: 'unchanged' | 'replace' | 'clear';
}

function normalizeRequiredString(value: string, fieldName: string): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalizedValue;
}

export function normalizeProfileHost(host: string): string {
  let url: URL;

  try {
    url = new URL(normalizeRequiredString(host, 'Canvas host'));
  } catch {
    throw new Error('Canvas host must be a valid HTTPS URL.');
  }

  if (url.protocol !== 'https:') {
    throw new Error('Canvas host must use HTTPS.');
  }

  url.pathname = '/';
  url.search = '';
  url.hash = '';

  return url.toString().replace(/\/$/, '');
}

export function normalizeStoredProfile(profile: ProfileRecord): ProfileRecord {
  return {
    host: normalizeProfileHost(profile.host),
    id: normalizeRequiredString(profile.id, 'Profile id'),
    name: normalizeRequiredString(profile.name, 'Profile name')
  };
}

export function normalizeProfileSaveRecord(profile: ProfileSaveRecord): ProfileSaveRecord {
  const normalizedProfile = normalizeStoredProfile(profile);

  if (profile.tokenAction === 'replace' && !profile.token.trim()) {
    throw new Error('Bearer token is required when replacing a saved token.');
  }

  return {
    ...normalizedProfile,
    token: profile.token,
    tokenAction: profile.tokenAction
  };
}

export function normalizeProfileCollection<T extends ProfileRecord>(profiles: T[]): T[] {
  const normalizedProfiles = profiles.map((profile) => ({
    ...profile,
    ...normalizeStoredProfile(profile)
  }));
  const seenIds = new Set<string>();

  for (const profile of normalizedProfiles) {
    if (seenIds.has(profile.id)) {
      throw new Error(`Profile id "${profile.id}" is duplicated.`);
    }

    seenIds.add(profile.id);
  }

  return normalizedProfiles;
}
