import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM, type DOMWindow } from 'jsdom';

const browserAppScript = readFileSync(resolve(process.cwd(), 'src/browser-app.js'), 'utf8');

afterEach(() => {
  vi.restoreAllMocks();
});

function createJsonResponse(payload: unknown) {
  return {
    ok: true,
    json: async () => payload
  };
}

function clickElement(window: DOMWindow, element: Element): void {
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function dispatchInput(window: DOMWindow, input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

async function waitForBrowserPaint(window: DOMWindow): Promise<void> {
  await new Promise((resolvePaint) => window.setTimeout(resolvePaint, 0));
  await new Promise((resolvePaint) => window.requestAnimationFrame(() => resolvePaint(undefined)));
}

async function createBrowserApp(options: {
  initialProfiles?: Array<{ hasToken: boolean; host: string; id: string; name: string }>;
} = {}) {
  const profiles = [...(options.initialProfiles ?? [])];
  const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
    pretendToBeVisual: true,
    runScripts: 'outside-only',
    url: 'http://127.0.0.1:3210/'
  });
  const { window } = dom;
  const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : String(input);
    const method = init?.method ?? 'GET';

    if (url.endsWith('/api/profiles') || url === '/api/profiles') {
      if (method === 'GET') {
        return createJsonResponse({ profiles });
      }

      if (method === 'PUT') {
        const requestBody = JSON.parse(String(init?.body ?? '{}')) as {
          profiles?: Array<{
            hasToken: boolean;
            host: string;
            id: string;
            name: string;
            tokenAction: 'unchanged' | 'replace' | 'clear';
          }>;
        };

        profiles.splice(
          0,
          profiles.length,
          ...(requestBody.profiles ?? []).map((profile) => ({
            hasToken: profile.tokenAction === 'replace' ? true : profile.tokenAction === 'clear' ? false : profile.hasToken,
            host: profile.host,
            id: profile.id,
            name: profile.name
          }))
        );

        return createJsonResponse({ profiles });
      }
    }

    throw new Error(`Unhandled fetch request: ${method} ${url}`);
  });

  Object.assign(window, {
    fetch: fetchMock,
    scrollTo: vi.fn()
  });
  window.requestAnimationFrame = (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0);
  window.cancelAnimationFrame = (handle: number) => window.clearTimeout(handle);

  window.eval(browserAppScript);
  await waitForBrowserPaint(window);

  return {
    cleanup: () => dom.window.close(),
    document: window.document,
    fetchMock,
    window
  };
}

describe('browser app editor behavior', () => {
  it('keeps focus on the start-field name input while rerendering the node view', async () => {
    const app = await createBrowserApp();

    try {
      const queryBuilderButton = app.document.querySelector('[data-action="switch-tab"][data-tab="query-builder"]');
      expect(queryBuilderButton).not.toBeNull();
      clickElement(app.window, queryBuilderButton as Element);

      const addFieldButton = app.document.querySelector('[data-action="add-start-field"]');
      expect(addFieldButton).not.toBeNull();
      clickElement(app.window, addFieldButton as Element);
      await waitForBrowserPaint(app.window);

      const nameInput = app.document.querySelector(
        '[data-start-field-field="name"]'
      ) as HTMLInputElement | null;
      expect(nameInput).not.toBeNull();

      nameInput?.focus();
      nameInput?.setSelectionRange(0, 0);
      dispatchInput(app.window, nameInput as HTMLInputElement, 'Name');
      await waitForBrowserPaint(app.window);

      const activeElement = app.document.activeElement as HTMLInputElement | null;
      expect(activeElement?.dataset.startFieldField).toBe('name');
      expect(activeElement?.value).toBe('Name');
      expect(activeElement?.selectionStart).toBe(4);
      expect(app.document.querySelector('.field-summary strong')?.textContent).toBe('Name');
    } finally {
      app.cleanup();
    }
  });

  it('autosaves profile edits without showing a success banner while the user types', async () => {
    const app = await createBrowserApp({
      initialProfiles: [
        {
          hasToken: false,
          host: 'https://canvas.example.edu',
          id: 'profile-1',
          name: 'Server 1'
        }
      ]
    });

    try {
      const serversButton = app.document.querySelector('[data-action="switch-tab"][data-tab="servers"]');
      expect(serversButton).not.toBeNull();
      clickElement(app.window, serversButton as Element);

      const profileNameInput = app.document.querySelector(
        '[data-profile-id="profile-1"][data-profile-field="name"]'
      ) as HTMLInputElement | null;
      expect(profileNameInput).not.toBeNull();

      profileNameInput?.focus();
      dispatchInput(app.window, profileNameInput as HTMLInputElement, 'uwm-prod');
      await new Promise((resolveSave) => app.window.setTimeout(resolveSave, 375));
      await waitForBrowserPaint(app.window);

      const activeElement = app.document.activeElement as HTMLInputElement | null;
      expect(activeElement?.dataset.profileField).toBe('name');
      expect(activeElement?.value).toBe('uwm-prod');
      expect(app.document.querySelector('.status-banner')).toBeNull();
      expect(
        app.fetchMock.mock.calls.some((call) => {
          const input = typeof call[0] === 'string' ? call[0] : String(call[0]);
          return input.endsWith('/api/profiles') && call[1]?.method === 'PUT';
        })
      ).toBe(true);
    } finally {
      app.cleanup();
    }
  });

  it('does not replace the start-field default-value input during cold numeric entry', async () => {
    const app = await createBrowserApp();

    try {
      const queryBuilderButton = app.document.querySelector('[data-action="switch-tab"][data-tab="query-builder"]');
      expect(queryBuilderButton).not.toBeNull();
      clickElement(app.window, queryBuilderButton as Element);

      const addFieldButton = app.document.querySelector('[data-action="add-start-field"]');
      expect(addFieldButton).not.toBeNull();
      clickElement(app.window, addFieldButton as Element);
      await waitForBrowserPaint(app.window);

      const typeSelect = app.document.querySelector(
        '[data-start-field-field="type"]'
      ) as HTMLSelectElement | null;
      expect(typeSelect).not.toBeNull();
      typeSelect!.value = 'integer';
      typeSelect!.dispatchEvent(new app.window.Event('input', { bubbles: true }));
      await waitForBrowserPaint(app.window);

      const defaultValueInput = app.document.querySelector(
        '[data-start-field-field="defaultValue"]'
      ) as HTMLInputElement | null;
      expect(defaultValueInput).not.toBeNull();

      defaultValueInput!.focus();
      dispatchInput(app.window, defaultValueInput as HTMLInputElement, '4');
      await waitForBrowserPaint(app.window);

      const sameDefaultValueInput = app.document.querySelector(
        '[data-start-field-field="defaultValue"]'
      ) as HTMLInputElement | null;
      expect(sameDefaultValueInput).toBe(defaultValueInput);

      dispatchInput(app.window, defaultValueInput as HTMLInputElement, '49');
      await waitForBrowserPaint(app.window);

      const activeElement = app.document.activeElement as HTMLInputElement | null;
      const currentDefaultValueInput = app.document.querySelector(
        '[data-start-field-field="defaultValue"]'
      ) as HTMLInputElement | null;

      expect(activeElement).toBe(defaultValueInput);
      expect(currentDefaultValueInput).toBe(defaultValueInput);
      expect(currentDefaultValueInput?.value).toBe('49');
    } finally {
      app.cleanup();
    }
  });

  it('does not render query-builder status banners after query actions', async () => {
    const app = await createBrowserApp();

    try {
      const queryBuilderButton = app.document.querySelector('[data-action="switch-tab"][data-tab="query-builder"]');
      expect(queryBuilderButton).not.toBeNull();
      clickElement(app.window, queryBuilderButton as Element);

      const addFieldButton = app.document.querySelector('[data-action="add-start-field"]');
      expect(addFieldButton).not.toBeNull();
      clickElement(app.window, addFieldButton as Element);
      await waitForBrowserPaint(app.window);

      expect(app.document.querySelector('.status-banner')).toBeNull();
    } finally {
      app.cleanup();
    }
  });

  it('filters unsupported characters from start-field and parameter names', async () => {
    const app = await createBrowserApp();

    try {
      const queryBuilderButton = app.document.querySelector('[data-action="switch-tab"][data-tab="query-builder"]');
      expect(queryBuilderButton).not.toBeNull();
      clickElement(app.window, queryBuilderButton as Element);

      const addFieldButton = app.document.querySelector('[data-action="add-start-field"]');
      expect(addFieldButton).not.toBeNull();
      clickElement(app.window, addFieldButton as Element);

      const addNodeButton = app.document.querySelector('[data-action="add-api-node"]');
      expect(addNodeButton).not.toBeNull();
      clickElement(app.window, addNodeButton as Element);
      await waitForBrowserPaint(app.window);

      const startFieldNameInput = app.document.querySelector(
        '[data-start-field-field="name"]'
      ) as HTMLInputElement | null;
      expect(startFieldNameInput).not.toBeNull();
      dispatchInput(app.window, startFieldNameInput as HTMLInputElement, 'na me!é_Имя[]-.$');
      await waitForBrowserPaint(app.window);

      const paramNameInput = app.document.querySelector(
        '[data-param-field="name"]'
      ) as HTMLInputElement | null;
      expect(paramNameInput).not.toBeNull();
      dispatchInput(app.window, paramNameInput as HTMLInputElement, 'pa ram?Ö_имя[]-.&');
      await waitForBrowserPaint(app.window);

      expect((app.document.querySelector('[data-start-field-field="name"]') as HTMLInputElement | null)?.value).toBe(
        'nameé_Имя[]-.'
      );
      expect((app.document.querySelector('[data-param-field="name"]') as HTMLInputElement | null)?.value).toBe(
        'paramÖ_имя[]-.'
      );
    } finally {
      app.cleanup();
    }
  });
});
