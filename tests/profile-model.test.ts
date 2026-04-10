import { describe, expect, it } from 'vitest';

import {
  normalizeProfileCollection,
  normalizeProfileHost,
  normalizeProfileSaveRecord
} from '../src/profile-model.js';

describe('profile-model', () => {
  it('normalizes HTTPS hosts and strips path/query/hash fragments', () => {
    expect(normalizeProfileHost(' https://canvas.example.edu/api/v1/courses?x=1#frag ')).toBe(
      'https://canvas.example.edu'
    );
  });

  it('rejects non-https hosts and empty replacement tokens', () => {
    expect(() => normalizeProfileHost('http://canvas.example.edu')).toThrow(
      'Canvas host must use HTTPS.'
    );
    expect(() =>
      normalizeProfileSaveRecord({
        host: 'https://canvas.example.edu',
        id: 'profile-1',
        name: 'UWM Prod',
        token: '   ',
        tokenAction: 'replace'
      })
    ).toThrow('Bearer token is required when replacing a saved token.');
  });

  it('rejects duplicate profile ids', () => {
    expect(() =>
      normalizeProfileCollection([
        { host: 'https://canvas.example.edu', id: 'profile-1', name: 'UWM Prod' },
        { host: 'https://canvas-test.example.edu', id: 'profile-1', name: 'UWM Test' }
      ])
    ).toThrow('Profile id "profile-1" is duplicated.');
  });
});
