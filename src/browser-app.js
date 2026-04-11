const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const FIELD_TYPES = [
  { label: 'Text', value: 'text' },
  { label: 'Number (Integer)', value: 'integer' },
  { label: 'Number (Decimal)', value: 'decimal' },
  { label: 'Date', value: 'date' },
  { label: 'Boolean (True/False)', value: 'boolean' }
]
const FIELD_TYPE_VALUES = FIELD_TYPES.map((fieldType) => fieldType.value)
const PROFILE_FIELDS = ['name', 'host', 'token']
const API_NODE_FIELDS = ['endpoint', 'method', 'profileId']
const START_FIELD_FIELDS = ['name', 'type', 'defaultValue']
const PARAM_FIELDS = ['name', 'value']
const PROFILE_SAVE_DELAY_MS = 300
const ICONS = {
  app: `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="24"></circle>
      <circle cx="32" cy="14.5" r="3.5"></circle>
      <circle cx="49.5" cy="32" r="3.5"></circle>
      <circle cx="32" cy="49.5" r="3.5"></circle>
      <circle cx="14.5" cy="32" r="3.5"></circle>
      <circle cx="44.5" cy="19.5" r="3"></circle>
      <circle cx="44.5" cy="44.5" r="3"></circle>
      <circle cx="19.5" cy="44.5" r="3"></circle>
      <circle cx="19.5" cy="19.5" r="3"></circle>
    </svg>
  `,
  about: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M12 10v6"></path>
      <circle cx="12" cy="7.5" r="1"></circle>
    </svg>
  `,
  add: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  `,
  eyeClosed: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18"></path>
      <path d="M10.6 10.6a3 3 0 0 0 4.24 4.24"></path>
      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.9c5.1 0 9.27 4.03 10 7.1a11.8 11.8 0 0 1-3.22 4.62"></path>
      <path d="M6.7 6.7C4.44 8 2.82 9.91 2 12c.46 1.18 1.24 2.42 2.33 3.56"></path>
    </svg>
  `,
  eyeOpen: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `,
  field: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4h12"></path>
      <path d="M6 10h12"></path>
      <path d="M6 16h8"></path>
      <circle cx="18" cy="16" r="2"></circle>
    </svg>
  `,
  flask: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3h4"></path>
      <path d="M11 3v5l-5.5 9.5A2 2 0 0 0 7.2 21h9.6a2 2 0 0 0 1.7-3.5L13 8V3"></path>
      <path d="M8.5 14h7"></path>
    </svg>
  `,
  nodes: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="6" height="6"></rect>
      <rect x="14" y="13" width="6" height="6"></rect>
      <path d="M10 8h4"></path>
      <path d="M14 8v8"></path>
    </svg>
  `,
  open: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h6l2 2h8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"></path>
      <path d="M4 8V6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2"></path>
    </svg>
  `,
  output: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14"></rect>
      <path d="M8 10h8"></path>
      <path d="M8 14h5"></path>
    </svg>
  `,
  queryBuilder: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="6" height="5"></rect>
      <rect x="15" y="5" width="6" height="5"></rect>
      <rect x="9" y="14" width="6" height="5"></rect>
      <path d="M9 7.5h6"></path>
      <path d="M12 10v4"></path>
    </svg>
  `,
  save: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h11l3 3v13H5z"></path>
      <path d="M8 4v6h7V4"></path>
      <path d="M8 17h8"></path>
    </svg>
  `,
  servers: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="6"></rect>
      <rect x="4" y="14" width="16" height="6"></rect>
      <path d="M8 7h.01"></path>
      <path d="M8 17h.01"></path>
      <path d="M12 7h4"></path>
      <path d="M12 17h4"></path>
    </svg>
  `,
  trash: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M6 7l1 13h10l1-13"></path>
      <path d="M9 7V4h6v3"></path>
    </svg>
  `
}

const appRoot = document.getElementById('app')

if (!(appRoot instanceof HTMLElement)) {
  throw new Error('Unable to mount the Canvas API Console UI.')
}

const state = createInitialState()
let dragState = null
let panState = null
let profileSaveTimer = null
let pendingWireLayerFrame = null
let wireDraft = null

function createInitialState() {
  return {
    activeTab: 'about',
    connections: [],
    formValues: {},
    nextIds: {
      field: 1,
      node: 1,
      param: 2,
      profile: 1,
      wire: 1
    },
    nodes: [
      {
        fields: [],
        id: 'start',
        position: { x: 56, y: 72 },
        type: 'start'
      },
      {
        columnsText: '',
        id: 'end',
        position: { x: 920, y: 120 },
        type: 'end'
      }
    ],
    profiles: [],
    queryView: 'nodes',
    statusByTab: createEmptyStatusByTab()
  }
}

function createEmptyStatusByTab() {
  return {
    about: {
      tone: 'neutral',
      value: ''
    },
    'query-builder': {
      tone: 'neutral',
      value: ''
    },
    servers: {
      tone: 'neutral',
      value: ''
    }
  }
}

function getStartNode() {
  return state.nodes.find((node) => node.type === 'start')
}

function getEndNode() {
  return state.nodes.find((node) => node.type === 'end')
}

function getNode(nodeId) {
  return state.nodes.find((node) => node.id === nodeId)
}

function getProfile(profileId) {
  return state.profiles.find((profile) => profile.id === profileId)
}

function createApiNode() {
  const nodeId = `node-${state.nextIds.node++}`
  const paramId = `param-${state.nextIds.param++}`

  return {
    endpoint: '/api/v1/courses',
    error: '',
    id: nodeId,
    lastTest: null,
    method: 'GET',
    params: [
      {
        id: paramId,
        name: 'search_term',
        value: ''
      }
    ],
    position: {
      x: 360 + state.nodes.filter((node) => node.type === 'api').length * 48,
      y: 84 + state.nodes.filter((node) => node.type === 'api').length * 42
    },
    profileId: state.profiles[0]?.id ?? '',
    testing: false,
    type: 'api'
  }
}

function createProfile() {
  const profileId = `profile-${state.nextIds.profile++}`

  return {
    hasToken: false,
    host: '',
    id: profileId,
    name: `Server ${state.profiles.length + 1}`,
    token: '',
    tokenDirty: false
  }
}

function createStartField() {
  const fieldId = `field-${state.nextIds.field++}`

  return {
    defaultValue: '',
    id: fieldId,
    name: '',
    type: 'text',
    visible: true
  }
}

function createQueryParameter() {
  const paramId = `param-${state.nextIds.param++}`

  return {
    id: paramId,
    name: '',
    value: ''
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function syncFormValues() {
  const startNode = getStartNode()

  if (!startNode) {
    state.formValues = {}
    return
  }

  const nextValues = {}

  for (const field of startNode.fields) {
    if (field.type === 'boolean') {
      nextValues[field.id] = state.formValues[field.id] === undefined
        ? field.defaultValue === 'true'
        : Boolean(state.formValues[field.id])
      continue
    }

    nextValues[field.id] = state.formValues[field.id] ?? field.defaultValue
  }

  state.formValues = nextValues
}

function escapeSelectorValue(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"')
}

function getControlSelector(control) {
  if (!(control instanceof HTMLElement)) {
    return null
  }

  if (control.id) {
    return `[id="${escapeSelectorValue(control.id)}"]`
  }

  if (control.dataset.profileId && control.dataset.profileField) {
    return `[data-profile-id="${escapeSelectorValue(control.dataset.profileId)}"][data-profile-field="${escapeSelectorValue(control.dataset.profileField)}"]`
  }

  if (control.dataset.nodeId && control.dataset.nodeField) {
    return `[data-node-id="${escapeSelectorValue(control.dataset.nodeId)}"][data-node-field="${escapeSelectorValue(control.dataset.nodeField)}"]`
  }

  if (control.dataset.startFieldId && control.dataset.startFieldField) {
    return `[data-start-field-id="${escapeSelectorValue(control.dataset.startFieldId)}"][data-start-field-field="${escapeSelectorValue(control.dataset.startFieldField)}"]`
  }

  if (control.dataset.nodeId && control.dataset.paramId && control.dataset.paramField) {
    return `[data-node-id="${escapeSelectorValue(control.dataset.nodeId)}"][data-param-id="${escapeSelectorValue(control.dataset.paramId)}"][data-param-field="${escapeSelectorValue(control.dataset.paramField)}"]`
  }

  if (control.dataset.endField) {
    return `[data-end-field="${escapeSelectorValue(control.dataset.endField)}"]`
  }

  if (control.dataset.formFieldId) {
    return `[data-form-field-id="${escapeSelectorValue(control.dataset.formFieldId)}"]`
  }

  return null
}

function captureFocusedControl() {
  const activeElement = document.activeElement

  if (!isFormControl(activeElement)) {
    return null
  }

  const selector = getControlSelector(activeElement)

  if (!selector) {
    return null
  }

  return {
    selectionDirection: 'selectionDirection' in activeElement ? activeElement.selectionDirection : null,
    selectionEnd: 'selectionEnd' in activeElement ? activeElement.selectionEnd : null,
    selectionStart: 'selectionStart' in activeElement ? activeElement.selectionStart : null,
    selector
  }
}

function restoreFocusedControl(snapshot) {
  if (!snapshot?.selector) {
    return
  }

  const control = appRoot.querySelector(snapshot.selector)

  if (!isFormControl(control)) {
    return
  }

  control.focus({ preventScroll: true })

  if (
    snapshot.selectionStart === null ||
    snapshot.selectionEnd === null ||
    !(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)
  ) {
    return
  }

  try {
    control.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd, snapshot.selectionDirection ?? undefined)
  } catch {
    // Controls like number/date inputs do not support selection ranges.
  }
}

function render(options = {}) {
  const { preserveFocus = false, preservePageScroll = false } = options
  const focusSnapshot = preserveFocus ? captureFocusedControl() : null
  const scrollX = preservePageScroll ? window.scrollX : 0
  const scrollY = preservePageScroll ? window.scrollY : 0

  syncFormValues()

  appRoot.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="app-brand" aria-label="Canvas API Console">
          <div class="app-brand-icon" aria-hidden="true">${renderIcon('app')}</div>
          <div class="app-brand-copy">
            <strong>Canvas API Console</strong>
            <span>Canvas LMS Admin</span>
          </div>
        </div>
        <nav class="nav-list" aria-label="Primary">
          ${renderNavButton('about', 'about', 'About', 'Overview of the local Canvas API Console.')}
          ${renderNavButton('servers', 'servers', 'Server Profiles', 'Manage Canvas hosts and device-keychain bearer tokens.')}
          ${renderNavButton('query-builder', 'queryBuilder', 'Query Builder', 'Design the node graph and preview output wiring.')}
        </nav>
      </aside>
      <main class="content">
        ${state.activeTab === 'about'
          ? renderAboutView()
          : state.activeTab === 'servers'
            ? renderServersView()
            : renderQueryBuilderView()}
      </main>
    </div>
  `

  scheduleUpdateWireLayer()

  if (!focusSnapshot && !preservePageScroll) {
    return
  }

  window.requestAnimationFrame(() => {
    if (preservePageScroll) {
      window.scrollTo(scrollX, scrollY)
    }

    restoreFocusedControl(focusSnapshot)
  })
}

function renderPreservingPageScroll() {
  render({ preserveFocus: true, preservePageScroll: true })
}

function renderIcon(iconName) {
  return `<span class="icon-svg">${ICONS[iconName] ?? ''}</span>`
}

function renderNavButton(tabId, iconName, label, description) {
  const activeClass = state.activeTab === tabId ? ' is-active' : ''

  return `
    <button
      class="nav-button${activeClass}"
      type="button"
      data-action="switch-tab"
      data-tab="${tabId}"
      aria-pressed="${state.activeTab === tabId}"
      aria-label="${escapeHtml(`${label}. ${description}`)}"
      title="${escapeHtml(description)}"
    >
      <span class="nav-icon" aria-hidden="true">${renderIcon(iconName)}</span>
      <span class="nav-label">${label}</span>
      <span class="sr-only">${escapeHtml(description)}</span>
    </button>
  `
}

function renderStatusBanner(tabId) {
  const status = state.statusByTab[tabId]

  if (!status?.value) {
    return ''
  }

  const toneClass = status.tone === 'error'
    ? ' is-error'
    : status.tone === 'success'
      ? ' is-success'
      : ''

  return `
    <div class="status-banner${toneClass}" role="status">
      <span>${escapeHtml(status.value)}</span>
      <button
        class="status-dismiss"
        type="button"
        data-action="dismiss-status"
        data-status-tab="${tabId}"
        aria-label="Dismiss notification"
        title="Dismiss notification"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
}

function renderAboutView() {
  return `
    <section class="content-grid">
      <header class="hero-panel">
        <div class="hero-copy">
          <h1>Canvas API Console</h1>
          <p>Local-first Canvas API tooling for authorized administrators who need inspectable requests, reusable workflows, and local-only credential handling.</p>
        </div>
      </header>
      ${renderStatusBanner('about')}
      <section class="about-section" aria-labelledby="about-local-heading">
        <div class="about-intro">
          <h2 id="about-local-heading">Work locally, keep credentials local</h2>
          <p>The app keeps Canvas profile metadata on your device and stores bearer tokens in the OS keychain through Node.js. Use Server Profiles to define environments, then use Query Builder to test requests without pushing credentials into files, screenshots, or third-party services.</p>
        </div>
        <div class="about-grid">
          <section class="about-item">
            <h3>About</h3>
            <p>This first tab is the overview: what the app is for, how credentials are handled, and where to start.</p>
          </section>
          <section class="about-item">
            <h3>Server Profiles</h3>
            <p>The second tab is a list of Canvas environments. Add a host, enter a token, and the token is saved to the device keychain instead of a plaintext file.</p>
          </section>
          <section class="about-item">
            <h3>Query Builder</h3>
            <p>Build and test request graphs after profiles are in place. Start and output nodes stay in the same workspace, with saved profiles available to each API node.</p>
          </section>
        </div>
      </section>
    </section>
  `
}

function renderServersView() {
  const profileList = state.profiles.length > 0
    ? `
      <div class="profile-list" role="list" aria-label="Server profile list">
        ${state.profiles.map((profile) => renderProfileCard(profile)).join('')}
      </div>
    `
    : `
      <div class="empty-state">
        <h3>No server profiles yet</h3>
        <p>Add your first Canvas environment here. Hosts are saved locally and bearer tokens are stored in the device keychain.</p>
      </div>
    `

  return `
    <section class="content-grid">
      <header class="page-header">
        <div>
          <h2>Canvas environments</h2>
          <p>Keep a list of Canvas servers on this device.</p>
        </div>
      </header>
      ${renderStatusBanner('servers')}
      <div class="helper-banner">
        Keep names explicit, such as <code>uwm-prod</code> or <code>uwm-test</code>. Tokens are saved to the OS keychain for local test calls and are never written into <code>.query.json</code> exports.
      </div>
      <div class="toolbar">
        <div class="toolbar-group">
          ${renderToolbarButton('add-profile', 'add', 'Add Server Profile', 'Create a new saved Canvas environment on this device.', true)}
        </div>
      </div>
      ${profileList}
    </section>
  `
}

function renderProfileCard(profile) {
  return `
    <section class="server-card" role="listitem" aria-labelledby="${profile.id}-heading">
      <div class="server-card-header">
        <div>
          <h3 id="${profile.id}-heading">${escapeHtml(profile.name || 'Untitled server')}</h3>
          <p>Host metadata is saved locally. Bearer tokens are kept in the device keychain.</p>
        </div>
        <button class="ghost-button" type="button" data-action="remove-profile" data-profile-id="${profile.id}">Remove</button>
      </div>
      <div class="server-card-body">
        <label class="control-group">
          <span>Profile name</span>
          <input type="text" value="${escapeHtml(profile.name)}" data-profile-id="${profile.id}" data-profile-field="name" />
        </label>
        <label class="control-group">
          <span>Canvas host</span>
          <input type="url" placeholder="https://canvas.example.edu" value="${escapeHtml(profile.host)}" data-profile-id="${profile.id}" data-profile-field="host" />
        </label>
        <label class="control-group">
          <span>Bearer token</span>
          <input type="password" autocomplete="off" placeholder="${profile.hasToken ? 'Saved in your device keychain' : 'Enter a token to save to the device keychain'}" value="${escapeHtml(profile.token)}" data-profile-id="${profile.id}" data-profile-field="token" />
        </label>
      </div>
      <div class="inline-actions server-card-footer">
        ${profile.hasToken
          ? '<span class="connection-label">Bearer token is stored in the device keychain.</span>'
          : '<span class="connection-label">No bearer token has been saved for this profile yet.</span>'}
        ${profile.hasToken
          ? `<button class="ghost-button" type="button" data-action="clear-profile-token" data-profile-id="${profile.id}">Clear saved token</button>`
          : ''}
      </div>
      <div class="card-note">Query Builder nodes can select this profile when testing Canvas endpoints.</div>
    </section>
  `
}

function renderQueryBuilderView() {
  return `
    <section class="content-grid">
      <header class="page-header">
        <div>
          <h2>Query Builder</h2>
          <p>Wire API calls into usable outputs.</p>
        </div>
      </header>
      ${renderStatusBanner('query-builder')}
      <div class="view-tabs" role="tablist" aria-label="Query views">
        ${renderViewTab('nodes', 'nodes', 'Node View', 'Arrange nodes and connections on the workspace.')}
        ${renderViewTab('output', 'output', 'Output View', 'Inspect start-field inputs and end-node output.')}
      </div>
      <div class="toolbar">
        <div class="toolbar-group toolbar-group-uniform">
          ${renderToolbarButton('add-api-node', 'add', 'Add API Node', 'Create a new API node in the workspace.', true)}
          ${renderToolbarButton('save-query', 'save', 'Save', 'Save the current wireframe as a .query.json file.')}
          ${renderToolbarButton('load-query', 'open', 'Open', 'Open a saved .query.json wireframe from disk.')}
          <input id="query-file-input" class="sr-only" type="file" accept=".query.json,application/json" />
        </div>
      </div>
      ${state.queryView === 'nodes' ? renderNodeSpace() : renderOutputView()}
    </section>
  `
}

function renderViewTab(queryView, iconName, label, description) {
  const active = state.queryView === queryView

  return `
    <button
      class="view-tab${active ? ' is-active' : ''}"
      type="button"
      role="tab"
      data-action="set-query-view"
      data-query-view="${queryView}"
      aria-selected="${active}"
      title="${escapeHtml(description)}"
    >
      <span class="view-tab-icon" aria-hidden="true">${renderIcon(iconName)}</span>
      <span>${label}</span>
      <span class="sr-only">${escapeHtml(description)}</span>
    </button>
  `
}

function renderToolbarButton(action, iconName, label, description, primary = false) {
  return `
    <button
      class="${primary ? 'primary-button' : 'secondary-button'} toolbar-button"
      type="button"
      data-action="${action}"
      aria-label="${escapeHtml(`${label}. ${description}`)}"
      title="${escapeHtml(description)}"
    >
      <span class="toolbar-button-icon" aria-hidden="true">${renderIcon(iconName)}</span>
      <span class="toolbar-button-label">${label}</span>
      <span class="sr-only">${escapeHtml(description)}</span>
    </button>
  `
}

function renderNodeSpace() {
  return `
    <section class="panel">
      <div class="section-header">
        <div>
          <h3>Node workspace</h3>
          <p>Drag nodes to reposition them, drag blank grid space to pan, and drag from an output handle to an input handle to create a wire.</p>
        </div>
      </div>
      <div id="node-space" class="node-space">
        <svg id="wire-layer" class="wire-layer" aria-hidden="true"></svg>
        ${state.nodes.map((node) => renderNode(node)).join('')}
      </div>
    </section>
  `
}

function renderNode(node) {
  if (node.type === 'start') {
    return renderStartNode(node)
  }

  if (node.type === 'end') {
    return renderEndNode(node)
  }

  return renderApiNode(node)
}

function renderStartNode(node) {
  return `
    <section class="node" data-node-id="${node.id}" data-node-type="start" style="left: ${node.position.x}px; top: ${node.position.y}px;">
      <div class="node-header" data-drag-handle="true" data-node-id="${node.id}" tabindex="0" aria-label="Start node title bar">
        <div>
          <h3>Start</h3>
        </div>
        <button
          class="ghost-button icon-button"
          type="button"
          data-action="add-start-field"
          aria-label="Add field"
          title="Add Field"
        >
          <span class="icon-button-mark" aria-hidden="true">${renderIcon('field')}</span>
          <span class="sr-only">Add field</span>
        </button>
      </div>
      <div class="node-body">
        <div class="helper-text">Add fields to define reusable inputs for the output view.</div>
        <div class="field-list">
          ${node.fields.length > 0
            ? node.fields.map((field) => renderStartField(field)).join('')
            : '<div class="empty-state"><h3>No fields yet</h3><p>Add a field to start shaping reusable input.</p></div>'}
        </div>
      </div>
    </section>
  `
}

function renderStartField(field) {
  const typeOptions = FIELD_TYPES.map((type) => `
    <option value="${type.value}"${field.type === type.value ? ' selected' : ''}>${type.label}</option>
  `).join('')
  const fieldLabel = field.name.trim() || 'Enter a Name'
  const visibilityLabel = field.visible ? 'Hide field from Output View' : 'Show field on Output View'
  const visibilityIcon = field.visible ? 'eyeOpen' : 'eyeClosed'
  const readyToConnect = isStartFieldReady(field)

  return `
    <div class="field-row">
      <div class="field-summary">
        <div class="field-actions">
          <strong>${escapeHtml(fieldLabel)}</strong>
          <div class="field-icon-actions">
            <button
              class="icon-control"
              type="button"
              data-action="toggle-start-field-visibility"
              data-field-id="${field.id}"
              aria-label="${escapeHtml(visibilityLabel)}"
              title="${escapeHtml(visibilityLabel)}"
            >
              <span class="icon-button-mark" aria-hidden="true">${renderIcon(visibilityIcon)}</span>
              <span class="sr-only">${escapeHtml(visibilityLabel)}</span>
            </button>
            <button
              class="icon-control"
              type="button"
              data-action="remove-start-field"
              data-field-id="${field.id}"
              aria-label="Delete field"
              title="Delete Field"
            >
              <span class="icon-button-mark" aria-hidden="true">${renderIcon('trash')}</span>
              <span class="sr-only">Delete field</span>
            </button>
          </div>
        </div>
      </div>
      <div class="field-editor">
        <div class="field-editor-layout">
          <div class="field-grid">
            <label class="control-group">
              <span>Name</span>
              <input
                type="text"
                value="${escapeHtml(field.name)}"
                placeholder="Enter a Name"
                data-start-field-id="${field.id}"
                data-start-field-field="name"
              />
            </label>
            <label class="control-group">
              <span>Type</span>
              <select data-start-field-id="${field.id}" data-start-field-field="type">${typeOptions}</select>
            </label>
            ${renderStartFieldValueEditor(field)}
          </div>
          ${readyToConnect ? renderFieldConnector(field.id, fieldLabel) : ''}
        </div>
      </div>
    </div>
  `
}

function isStartFieldReady(field) {
  if (!field.name.trim() || !field.type) {
    return false
  }

  if (field.type === 'boolean') {
    return field.defaultValue === 'true' || field.defaultValue === 'false'
  }

  return field.defaultValue.trim() !== ''
}

function renderFieldConnector(fieldId, fieldLabel) {
  return `
    <span
      class="field-connector"
      data-direction="output"
      data-node-id="start"
      data-handle-key="${fieldId}"
      title="${escapeHtml(`Use ${fieldLabel} as an input source`)}"
      aria-hidden="true"
    >●</span>
  `
}

function renderStartFieldValueEditor(field) {
  if (field.type === 'boolean') {
    return `
      <label class="control-group">
        <span>Default Value</span>
        <select data-start-field-id="${field.id}" data-start-field-field="defaultValue">
          <option value="false"${field.defaultValue !== 'true' ? ' selected' : ''}>False</option>
          <option value="true"${field.defaultValue === 'true' ? ' selected' : ''}>True</option>
        </select>
      </label>
    `
  }

  const inputType = field.type === 'text'
    ? 'text'
    : field.type === 'date'
      ? 'date'
      : 'number'
  const step = field.type === 'integer' ? '1' : field.type === 'decimal' ? 'any' : null

  return `
    <label class="control-group">
      <span>Default Value</span>
      <input
        type="${inputType}"
        value="${escapeHtml(field.defaultValue)}"
        ${step ? `step="${step}"` : ''}
        data-start-field-id="${field.id}"
        data-start-field-field="defaultValue"
      />
    </label>
  `
}

function renderApiNode(node) {
  const profileOptions = [
    '<option value="">Select a server profile</option>',
    ...state.profiles.map((profile) => `
      <option value="${profile.id}"${profile.id === node.profileId ? ' selected' : ''}>${escapeHtml(profile.name || profile.host || profile.id)}</option>
    `)
  ].join('')
  const methodOptions = HTTP_METHODS.map((method) => `
    <option value="${method}"${node.method === method ? ' selected' : ''}>${method}</option>
  `).join('')
  const outputDescriptors = getOutputDescriptors(node)
  const testLabel = node.testing ? 'Testing node' : 'Test node'

  return `
    <section class="node" data-node-id="${node.id}" data-node-type="api" style="left: ${node.position.x}px; top: ${node.position.y}px;">
      <div class="node-header" data-drag-handle="true" data-node-id="${node.id}" tabindex="0" aria-label="${escapeHtml(`${node.endpoint || 'API node'} title bar`)}">
        <div>
          <h3>${escapeHtml(node.endpoint || 'API node')}</h3>
        </div>
        <div class="node-actions">
          <button
            class="icon-control"
            type="button"
            data-action="test-node"
            data-node-id="${node.id}"
            aria-label="${escapeHtml(testLabel)}"
            title="${escapeHtml(testLabel)}"
            ${node.testing ? 'disabled' : ''}
          >
            <span class="icon-button-mark" aria-hidden="true">${renderIcon('flask')}</span>
            <span class="sr-only">${escapeHtml(testLabel)}</span>
          </button>
          <button
            class="icon-control"
            type="button"
            data-action="remove-node"
            data-node-id="${node.id}"
            aria-label="Delete node"
            title="Delete Node"
          >
            <span class="icon-button-mark" aria-hidden="true">${renderIcon('trash')}</span>
            <span class="sr-only">Delete node</span>
          </button>
        </div>
      </div>
      <div class="node-body">
        <div class="node-grid">
          <label class="control-group">
            <span>Server profile</span>
            <select data-node-id="${node.id}" data-node-field="profileId">${profileOptions}</select>
          </label>
          <label class="control-group">
            <span>Method</span>
            <select data-node-id="${node.id}" data-node-field="method">${methodOptions}</select>
          </label>
        </div>
        <label class="control-group">
          <span>API endpoint</span>
          <input type="text" value="${escapeHtml(node.endpoint)}" placeholder="/api/v1/courses" data-node-id="${node.id}" data-node-field="endpoint" />
        </label>
        <div class="control-group">
          <div class="section-action-row">
            <span>Query parameters</span>
            <button
              class="icon-control"
              type="button"
              data-action="add-param"
              data-node-id="${node.id}"
              aria-label="Add query parameter"
              title="Add Query Parameter"
            >
              <span class="icon-button-mark" aria-hidden="true">${renderIcon('field')}</span>
              <span class="sr-only">Add query parameter</span>
            </button>
          </div>
          <div class="param-list">${node.params.map((param) => renderParamRow(node, param)).join('')}</div>
        </div>
        <div class="control-group">
          <span>Output handles</span>
          ${outputDescriptors.length > 0
            ? `<div class="output-handle-list">${outputDescriptors.map((descriptor) => renderOutputHandleRow(node.id, descriptor)).join('')}</div>`
            : '<div class="helper-text">Run a test call to turn the returned properties into output wires.</div>'}
        </div>
        ${renderNodeTestState(node)}
      </div>
    </section>
  `
}

function renderParamRow(node, param) {
  const connection = getConnectionForTarget(node.id, `param:${param.id}`)
  const sourceLabel = connection ? getSourceLabel(connection.source) : ''
  const paramLabel = param.name.trim() || 'Enter a Name'

  return `
    <div class="param-row">
      <div class="field-summary">
        <div class="field-actions">
          <strong>${escapeHtml(paramLabel)}</strong>
          <div class="field-icon-actions">
            ${renderInputHandle(node.id, `param:${param.id}`, `Wire a value into ${paramLabel}`)}
            <button
              class="icon-control"
              type="button"
              data-action="remove-param"
              data-node-id="${node.id}"
              data-param-id="${param.id}"
              aria-label="Delete query parameter"
              title="Delete Query Parameter"
            >
              <span class="icon-button-mark" aria-hidden="true">${renderIcon('trash')}</span>
              <span class="sr-only">Delete query parameter</span>
            </button>
          </div>
        </div>
        <div class="helper-text">${connection ? `Connected from ${escapeHtml(sourceLabel)}` : 'Manual value'}</div>
      </div>
      <div class="field-editor">
        <div class="field-grid">
          <label class="control-group">
            <span>Name</span>
            <input
              type="text"
              placeholder="Enter a Name"
              value="${escapeHtml(param.name)}"
              data-node-id="${node.id}"
              data-param-id="${param.id}"
              data-param-field="name"
            />
          </label>
          <label class="control-group">
            <span>Value</span>
            <input
              type="text"
              placeholder="Manual value"
              value="${escapeHtml(param.value)}"
              data-node-id="${node.id}"
              data-param-id="${param.id}"
              data-param-field="value"
              ${connection ? 'disabled' : ''}
            />
          </label>
          ${connection
            ? `
              <div class="control-group control-group-spacer">
                <span></span>
                <button
                  class="ghost-button small-action"
                  type="button"
                  data-action="remove-connection"
                  data-target-node-id="${node.id}"
                  data-target-handle-key="param:${param.id}"
                >
                  Disconnect
                </button>
              </div>
            `
            : ''}
        </div>
      </div>
    </div>
  `
}

function renderOutputHandleRow(nodeId, descriptor) {
  return `
    <div class="output-handle-row">
      <div class="field-actions">
        <div>
          <strong>${escapeHtml(descriptor.label)}</strong>
          <div class="helper-text">${escapeHtml(descriptor.description)}</div>
        </div>
        ${renderOutputHandle(nodeId, descriptor.key, `Connect ${descriptor.label} to another node`)}
      </div>
    </div>
  `
}

function renderNodeTestState(node) {
  if (!node.lastTest) {
    return '<div class="helper-text">Node tests return data that can feed the end node or downstream query parameters.</div>'
  }

  if (!node.lastTest.ok) {
    return `
      <div class="status-banner is-error">
        <strong>Last test failed</strong>
        <div class="test-result-meta">${escapeHtml(node.lastTest.error)}</div>
      </div>
    `
  }

  return `
    <div class="status-banner is-success">
      <strong>Last test succeeded</strong>
      <div class="test-result-meta">HTTP ${node.lastTest.status}</div>
      <pre>${escapeHtml(JSON.stringify(node.lastTest.data, null, 2))}</pre>
    </div>
  `
}

function renderEndNode(node) {
  const connection = getConnectionForTarget(node.id, 'input')

  return `
    <section class="node" data-node-id="${node.id}" data-node-type="end" style="left: ${node.position.x}px; top: ${node.position.y}px;">
      <div class="node-header" data-drag-handle="true" data-node-id="${node.id}" tabindex="0" aria-label="End node title bar">
        <div>
          <h3>End</h3>
        </div>
        ${renderInputHandle(node.id, 'input', 'Connect a tested output into the end node')}
      </div>
      <div class="node-body">
        <div class="helper-text">The output view shows the fields from the start node above whichever tested value is piped into this node.</div>
        <label class="control-group">
          <span>Visible columns</span>
          <input type="text" placeholder="id, name, sis_course_id" value="${escapeHtml(node.columnsText)}" data-end-field="columnsText" />
        </label>
        ${connection
          ? `<div class="connection-label">Connected from ${escapeHtml(getSourceLabel(connection.source))}</div>`
          : '<div class="connection-label">No source is connected yet.</div>'}
        ${connection
          ? `<button class="ghost-button" type="button" data-action="remove-connection" data-target-node-id="${node.id}" data-target-handle-key="input">Disconnect input</button>`
          : ''}
      </div>
    </section>
  `
}

function renderOutputView() {
  const startNode = getStartNode()
  const endNode = getEndNode()
  const endValue = resolveEndNodeValue()
  const visibleFields = startNode.fields.filter((field) => field.visible !== false)

  return `
    <section class="output-layout">
      <section class="output-card">
        <div class="output-header">
          <div>
            <h3>Start fields</h3>
            <p>These inputs use the default values configured on the start node and can be adjusted before you test downstream nodes.</p>
          </div>
          <button class="ghost-button" type="button" data-action="reset-form-values">Reset to defaults</button>
        </div>
        <div class="output-fields">
          ${visibleFields.length > 0
            ? visibleFields.map((field) => renderOutputField(field)).join('')
            : '<div class="empty-state"><h3>No visible fields</h3><p>Add a field and leave it visible to collect reusable input values here.</p></div>'}
        </div>
      </section>
      <section class="output-card">
        <div class="output-header">
          <div>
            <h3>End node output</h3>
            <p>Data from the wire connected into the end node appears below.</p>
          </div>
        </div>
        ${endValue.available
          ? renderResolvedOutput(endValue.value, endNode.columnsText)
          : `<div class="empty-state"><h3>No end-node data yet</h3><p>${escapeHtml(endValue.message)}</p></div>`}
      </section>
    </section>
  `
}

function renderOutputField(field) {
  const value = state.formValues[field.id]

  if (field.type === 'boolean') {
    return `
      <section class="field-card">
        <label>
          <span>${escapeHtml(field.name || 'Enter a Name')}</span>
          <input type="checkbox" ${value ? 'checked' : ''} data-form-field-id="${field.id}" />
        </label>
      </section>
    `
  }

  return `
    <section class="field-card">
      <label>
        <span>${escapeHtml(field.name || 'Enter a Name')}</span>
        <input
          type="${field.type === 'text' ? 'text' : field.type === 'date' ? 'date' : 'number'}"
          ${field.type === 'integer' ? 'step="1"' : field.type === 'decimal' ? 'step="any"' : ''}
          value="${escapeHtml(value)}"
          data-form-field-id="${field.id}"
        />
      </label>
    </section>
  `
}

function renderResolvedOutput(value, columnsText) {
  if (Array.isArray(value)) {
    return renderArrayOutput(value, columnsText)
  }

  if (isPlainObject(value)) {
    return renderRecordOutput(value, columnsText)
  }

  return `<pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>`
}

function renderArrayOutput(value, columnsText) {
  if (value.length === 0) {
    return '<div class="empty-state"><h3>Empty array</h3><p>The connected output returned an empty list.</p></div>'
  }

  const selectedColumns = parseColumns(columnsText)

  if (!isPlainObject(value[0])) {
    return `
      <div class="table-container">
        <table>
          <thead><tr><th>value</th></tr></thead>
          <tbody>${value.map((item) => `<tr><td><pre>${escapeHtml(JSON.stringify(item, null, 2))}</pre></td></tr>`).join('')}</tbody>
        </table>
      </div>
    `
  }

  const allColumns = Array.from(new Set(value.flatMap((item) => Object.keys(item))))
  const columns = selectedColumns.length > 0 ? selectedColumns : allColumns

  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${value.map((item) => `
            <tr>
              ${columns.map((column) => `<td>${formatCellValue(item[column])}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderRecordOutput(value, columnsText) {
  const selectedColumns = parseColumns(columnsText)
  const columns = selectedColumns.length > 0 ? selectedColumns : Object.keys(value)

  return `
    <div class="record-grid">
      ${columns.map((column) => `
        <div class="record-row">
          <strong>${escapeHtml(column)}</strong>
          ${formatCellValue(value[column])}
        </div>
      `).join('')}
    </div>
  `
}

function formatCellValue(value) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return escapeHtml(value)
  }

  if (value === null || value === undefined) {
    return '<span class="muted">—</span>'
  }

  return `<pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>`
}

function renderOutputHandle(nodeId, handleKey, label) {
  return `
    <button
      class="handle handle-output"
      type="button"
      data-direction="output"
      data-node-id="${nodeId}"
      data-handle-key="${handleKey}"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(label)}"
    >●</button>
  `
}

function renderInputHandle(nodeId, handleKey, label) {
  return `
    <button
      class="handle handle-input"
      type="button"
      data-direction="input"
      data-node-id="${nodeId}"
      data-handle-key="${handleKey}"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(label)}"
    >●</button>
  `
}

function parseColumns(columnsText) {
  return columnsText
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function getOutputDescriptors(node) {
  if (!node.lastTest || !node.lastTest.ok) {
    return []
  }

  return describeOutputs(node.lastTest.data)
}

function describeOutputs(data) {
  const descriptors = [
    {
      description: 'Wire the full response into another input or into the end node.',
      key: '$',
      label: Array.isArray(data) ? 'Result array' : 'Result'
    }
  ]

  if (Array.isArray(data) && data.length > 0 && isPlainObject(data[0])) {
    for (const key of Object.keys(data[0])) {
      descriptors.push({
        description: 'Uses the first row value when this array output is connected onward.',
        key,
        label: `${key} (first row)`
      })
    }
  } else if (isPlainObject(data)) {
    for (const key of Object.keys(data)) {
      descriptors.push({
        description: 'Top-level response property.',
        key,
        label: key
      })
    }
  }

  return descriptors
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function getConnectionForTarget(nodeId, handleKey) {
  return state.connections.find((connection) => connection.target.nodeId === nodeId && connection.target.handleKey === handleKey)
}

function getSourceLabel(source) {
  const sourceNode = getNode(source.nodeId)

  if (!sourceNode) {
    return 'unknown source'
  }

  if (sourceNode.type === 'start') {
    const field = sourceNode.fields.find((item) => item.id === source.handleKey)
    return field?.name || 'start field'
  }

  if (sourceNode.type === 'api') {
    const descriptor = getOutputDescriptors(sourceNode).find((item) => item.key === source.handleKey)
    return descriptor?.label || `${sourceNode.endpoint || sourceNode.id} output`
  }

  return 'end node'
}

function resolveSourceValue(source) {
  const sourceNode = getNode(source.nodeId)

  if (!sourceNode) {
    return undefined
  }

  if (sourceNode.type === 'start') {
    return state.formValues[source.handleKey]
  }

  if (sourceNode.type !== 'api' || !sourceNode.lastTest || !sourceNode.lastTest.ok) {
    return undefined
  }

  if (source.handleKey === '$') {
    return sourceNode.lastTest.data
  }

  if (Array.isArray(sourceNode.lastTest.data)) {
    const firstRow = sourceNode.lastTest.data[0]
    return isPlainObject(firstRow) ? firstRow[source.handleKey] : undefined
  }

  if (isPlainObject(sourceNode.lastTest.data)) {
    return sourceNode.lastTest.data[source.handleKey]
  }

  return undefined
}

function resolveEndNodeValue() {
  const connection = getConnectionForTarget('end', 'input')

  if (!connection) {
    return {
      available: false,
      message: 'Connect a tested API-node result into the end node from the node view.',
      value: null
    }
  }

  const value = resolveSourceValue(connection.source)

  if (value === undefined) {
    return {
      available: false,
      message: 'The connected source has not produced a tested value yet.',
      value: null
    }
  }

  return {
    available: true,
    message: '',
    value
  }
}

async function loadPersistedProfiles() {
  try {
    const response = await fetch('/api/profiles')
    const payload = await response.json()

    if (!response.ok || !Array.isArray(payload.profiles)) {
      throw new Error('Unable to load saved server profiles.')
    }

    state.profiles = payload.profiles.map((profile, index) => ({
      hasToken: Boolean(profile.hasToken),
      host: typeof profile.host === 'string' ? profile.host : '',
      id: typeof profile.id === 'string' ? profile.id : `profile-${index + 1}`,
      name: typeof profile.name === 'string' ? profile.name : `Server ${index + 1}`,
      token: '',
      tokenDirty: false
    }))
    state.nextIds = computeNextIds(state)
  } catch {
    setStatus('Unable to load saved server profiles from local storage.', 'error', 'servers')
  }

  render()
}

function buildProfileSaveRequest() {
  return {
    profiles: state.profiles.map((profile) => ({
      hasToken: Boolean(profile.hasToken),
      host: profile.host,
      id: profile.id,
      name: profile.name,
      token: profile.token,
      tokenAction: profile.tokenDirty
        ? profile.token.trim()
          ? 'replace'
          : 'clear'
        : 'unchanged'
    }))
  }
}

async function persistProfiles(options = {}) {
  const { announce = false, successMessage = 'Saved server profiles locally.' } = options

  try {
    const response = await fetch('/api/profiles', {
      body: JSON.stringify(buildProfileSaveRequest()),
      headers: {
        'content-type': 'application/json'
      },
      method: 'PUT'
    })
    const payload = await response.json()

    if (!response.ok || !Array.isArray(payload.profiles)) {
      throw new Error('Unable to save server profiles.')
    }

    state.profiles = payload.profiles.map((profile, index) => ({
      hasToken: Boolean(profile.hasToken),
      host: typeof profile.host === 'string' ? profile.host : '',
      id: typeof profile.id === 'string' ? profile.id : `profile-${index + 1}`,
      name: typeof profile.name === 'string' ? profile.name : `Server ${index + 1}`,
      token: '',
      tokenDirty: false
    }))
    state.nextIds = computeNextIds(state)

    if (announce) {
      setStatus(successMessage, 'success')
      return true
    }

    render({ preserveFocus: true })
    return true
  } catch {
    setStatus('Unable to save server profiles locally.', 'error')
    return false
  }
}

function queueProfileSave() {
  window.clearTimeout(profileSaveTimer)
  profileSaveTimer = window.setTimeout(() => {
    void persistProfiles()
  }, PROFILE_SAVE_DELAY_MS)
}

function setStatus(value, tone = 'neutral', tabId = state.activeTab) {
  state.statusByTab[tabId] = { tone, value }
  render({ preserveFocus: true })
}

function clearStatus(tabId = state.activeTab) {
  state.statusByTab[tabId] = { tone: 'neutral', value: '' }
  render({ preserveFocus: true })
}

function scheduleUpdateWireLayer() {
  if (pendingWireLayerFrame !== null) {
    return
  }

  pendingWireLayerFrame = window.requestAnimationFrame(() => {
    pendingWireLayerFrame = null
    updateWireLayer()
  })
}

function updateNodeElementPosition(nodeId) {
  const node = getNode(nodeId)
  const nodeElement = appRoot.querySelector(`[data-node-id="${nodeId}"]`)

  if (!node || !(nodeElement instanceof HTMLElement)) {
    return
  }

  nodeElement.style.left = `${node.position.x}px`
  nodeElement.style.top = `${node.position.y}px`
  updateWireLayer()
}

function getCanvasPoint(event, nodeSpace) {
  const spaceRect = nodeSpace.getBoundingClientRect()

  return {
    x: event.clientX - spaceRect.left + nodeSpace.scrollLeft,
    y: event.clientY - spaceRect.top + nodeSpace.scrollTop
  }
}

function getHandleCenter(nodeId, handleKey, direction) {
  const nodeSpace = document.getElementById('node-space')
  const handleElement = appRoot.querySelector(
    `[data-node-id="${nodeId}"][data-handle-key="${handleKey}"][data-direction="${direction}"]`
  )

  if (!(nodeSpace instanceof HTMLElement) || !(handleElement instanceof HTMLElement)) {
    return null
  }

  const spaceRect = nodeSpace.getBoundingClientRect()
  const handleRect = handleElement.getBoundingClientRect()

  return {
    x: handleRect.left - spaceRect.left + handleRect.width / 2 + nodeSpace.scrollLeft,
    y: handleRect.top - spaceRect.top + handleRect.height / 2 + nodeSpace.scrollTop
  }
}

function buildWirePath(startPoint, endPoint) {
  const curveDistance = Math.max(80, Math.abs(endPoint.x - startPoint.x) * 0.45)

  return `M ${startPoint.x} ${startPoint.y} C ${startPoint.x + curveDistance} ${startPoint.y}, ${endPoint.x - curveDistance} ${endPoint.y}, ${endPoint.x} ${endPoint.y}`
}

function updateWireLayer() {
  const wireLayer = document.getElementById('wire-layer')
  const nodeSpace = document.getElementById('node-space')

  if (!(wireLayer instanceof SVGElement) || !(nodeSpace instanceof HTMLElement)) {
    return
  }

  const width = Math.max(nodeSpace.scrollWidth, nodeSpace.clientWidth)
  const height = Math.max(nodeSpace.scrollHeight, nodeSpace.clientHeight)
  wireLayer.setAttribute('viewBox', `0 0 ${width} ${height}`)

  const paths = []

  for (const connection of state.connections) {
    const startPoint = getHandleCenter(connection.source.nodeId, connection.source.handleKey, 'output')
    const endPoint = getHandleCenter(connection.target.nodeId, connection.target.handleKey, 'input')

    if (!startPoint || !endPoint) {
      continue
    }

    paths.push(`<path class="wire-path" d="${buildWirePath(startPoint, endPoint)}"></path>`)
  }

  if (wireDraft) {
    paths.push(`<path class="wire-path is-draft" d="${buildWirePath(wireDraft.startPoint, wireDraft.currentPoint)}"></path>`)
  }

  wireLayer.innerHTML = paths.join('')
}

function removeConnectionsForNode(nodeId) {
  state.connections = state.connections.filter((connection) => connection.source.nodeId !== nodeId && connection.target.nodeId !== nodeId)
}

function removeConnection(targetNodeId, targetHandleKey) {
  state.connections = state.connections.filter(
    (connection) => !(connection.target.nodeId === targetNodeId && connection.target.handleKey === targetHandleKey)
  )
}

function resetNodeTestsReferencingSource(nodeId) {
  for (const node of state.nodes) {
    if (node.type === 'api' && node.id === nodeId) {
      continue
    }

    if (node.type === 'api') {
      const hasDependency = state.connections.some(
        (connection) => connection.target.nodeId === node.id && connection.source.nodeId === nodeId
      )

      if (hasDependency) {
        node.lastTest = null
      }
    }
  }
}

function buildQueryExport() {
  return {
    columnsNote: 'Bearer tokens and test responses are intentionally excluded.',
    connections: state.connections,
    nodes: state.nodes.map((node) => {
      if (node.type === 'api') {
        return {
          endpoint: node.endpoint,
          id: node.id,
          method: node.method,
          params: node.params,
          position: node.position,
          profileId: node.profileId,
          type: node.type
        }
      }

      return node
    }),
    profiles: state.profiles.map((profile) => ({
      host: profile.host,
      id: profile.id,
      name: profile.name,
      token: ''
    })),
    version: 1
  }
}

function saveQueryToFile() {
  const blob = new Blob([JSON.stringify(buildQueryExport(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'canvas-query.query.json'
  link.click()
  URL.revokeObjectURL(url)
  setStatus('Saved the current wireframe as a .query.json file.', 'success')
}

function loadQueryFromFile(file) {
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    try {
      if (typeof reader.result !== 'string') {
        throw new Error('Unable to read the selected .query.json file.')
      }

      const parsed = JSON.parse(reader.result)
      hydrateState(parsed)
      void persistProfiles()
      setStatus('Loaded a .query.json file. Bearer tokens must be re-entered locally.', 'success')
    } catch {
      setStatus('The selected file is not a valid .query.json export.', 'error')
    }
  })

  reader.readAsText(file)
}

function hydrateState(parsed) {
  const nextState = createInitialState()

  if (Array.isArray(parsed.profiles)) {
    nextState.profiles = parsed.profiles.map((profile, index) => ({
      hasToken: false,
      host: typeof profile.host === 'string' ? profile.host : '',
      id: typeof profile.id === 'string' ? profile.id : `profile-${index + 1}`,
      name: typeof profile.name === 'string' ? profile.name : `Server ${index + 1}`,
      token: '',
      tokenDirty: false
    }))
  }

  if (Array.isArray(parsed.nodes)) {
    const loadedNodes = parsed.nodes.filter((node) => node && typeof node === 'object' && typeof node.type === 'string')
    const hasStart = loadedNodes.some((node) => node.type === 'start')
    const hasEnd = loadedNodes.some((node) => node.type === 'end')

    if (hasStart && hasEnd) {
      nextState.nodes = loadedNodes.map((node, index) => {
        if (node.type === 'start') {
          return {
            fields: Array.isArray(node.fields)
              ? node.fields.map((field, fieldIndex) => ({
                  defaultValue: typeof field.defaultValue === 'string' ? field.defaultValue : '',
                  id: typeof field.id === 'string' ? field.id : `field-${fieldIndex + 1}`,
                  name: typeof field.name === 'string' ? field.name : '',
                  type: FIELD_TYPE_VALUES.includes(field.type) ? field.type : 'text',
                  visible: field.visible !== false
                }))
              : [],
            id: typeof node.id === 'string' ? node.id : 'start',
            position: normalizePosition(node.position, index),
            type: 'start'
          }
        }

        if (node.type === 'end') {
          return {
            columnsText: typeof node.columnsText === 'string' ? node.columnsText : '',
            id: typeof node.id === 'string' ? node.id : 'end',
            position: normalizePosition(node.position, index),
            type: 'end'
          }
        }

        return {
          endpoint: typeof node.endpoint === 'string' ? node.endpoint : '/api/v1/courses',
          error: '',
          id: typeof node.id === 'string' ? node.id : `node-${index + 1}`,
          lastTest: null,
          method: HTTP_METHODS.includes(node.method) ? node.method : 'GET',
          params: Array.isArray(node.params) && node.params.length > 0
            ? node.params.map((param, paramIndex) => ({
                id: typeof param.id === 'string' ? param.id : `param-${paramIndex + 1}`,
                name: typeof param.name === 'string' ? param.name : '',
                value: typeof param.value === 'string' ? param.value : ''
              }))
            : [createQueryParameter()],
          position: normalizePosition(node.position, index),
          profileId: typeof node.profileId === 'string' ? node.profileId : '',
          testing: false,
          type: 'api'
        }
      })
    }
  }

  if (Array.isArray(parsed.connections)) {
    nextState.connections = parsed.connections.filter(
      (connection) => connection?.source?.nodeId && connection?.source?.handleKey && connection?.target?.nodeId && connection?.target?.handleKey
    ).map((connection, index) => ({
      id: typeof connection.id === 'string' ? connection.id : `wire-${index + 1}`,
      source: {
        handleKey: String(connection.source.handleKey),
        nodeId: String(connection.source.nodeId)
      },
      target: {
        handleKey: String(connection.target.handleKey),
        nodeId: String(connection.target.nodeId)
      }
    }))
  }

  nextState.nextIds = computeNextIds(nextState)
  state.activeTab = 'query-builder'
  state.connections = nextState.connections
  state.formValues = {}
  state.nextIds = nextState.nextIds
  state.nodes = nextState.nodes
  state.profiles = nextState.profiles
  state.queryView = 'nodes'
}

function normalizePosition(position, index) {
  return {
    x: typeof position?.x === 'number' ? position.x : 96 + index * 32,
    y: typeof position?.y === 'number' ? position.y : 96 + index * 32
  }
}

function computeNextIds(nextState) {
  const ids = {
    field: 1,
    node: 1,
    param: 1,
    profile: 1,
    wire: 1
  }

  for (const profile of nextState.profiles) {
    ids.profile = Math.max(ids.profile, numericSuffix(profile.id) + 1)
  }

  for (const node of nextState.nodes) {
    ids.node = Math.max(ids.node, numericSuffix(node.id) + 1)

    if (node.type === 'start') {
      for (const field of node.fields) {
        ids.field = Math.max(ids.field, numericSuffix(field.id) + 1)
      }
    }

    if (node.type === 'api') {
      for (const param of node.params) {
        ids.param = Math.max(ids.param, numericSuffix(param.id) + 1)
      }
    }
  }

  for (const connection of nextState.connections) {
    ids.wire = Math.max(ids.wire, numericSuffix(connection.id) + 1)
  }

  return ids
}

function numericSuffix(value) {
  if (typeof value !== 'string') {
    return 0
  }

  const match = /-(\d+)$/.exec(value)
  return match ? Number(match[1]) : 0
}

async function testNode(nodeId) {
  const node = getNode(nodeId)

  if (!node || node.type !== 'api') {
    return
  }

  const profile = getProfile(node.profileId)

  if (!profile) {
    setStatus('Select a server profile before testing a node.', 'error')
    return
  }

  if (profile.tokenDirty) {
    const didPersist = await persistProfiles()

    if (!didPersist) {
      return
    }
  }

  node.testing = true
  render()

  try {
    const queryParameters = node.params
      .map((param) => ({
        id: param.id,
        name: param.name.trim(),
        value: stringifyParameterValue(resolveParameterValue(node.id, param))
      }))
      .filter((param) => param.name)
    const response = await fetch('/api/test-node', {
      body: JSON.stringify({
        endpoint: node.endpoint,
        method: node.method,
        profileId: profile.id,
        queryParameters
      }),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    })
    const payload = await response.json()

    if (!payload.ok) {
      node.lastTest = {
        error: String(payload.error || 'The request failed.'),
        ok: false,
        status: Number(payload.status || 0)
      }
      setStatus(`Test failed for ${node.endpoint || node.id}.`, 'error')
      return
    }

    node.lastTest = {
      data: payload.data,
      ok: true,
      status: Number(payload.status || response.status)
    }
    setStatus(`Test succeeded for ${node.endpoint || node.id}.`, 'success')
  } catch {
    node.lastTest = {
      error: 'The local app could not reach the test endpoint.',
      ok: false,
      status: 0
    }
    setStatus(`Test failed for ${node.endpoint || node.id}.`, 'error')
  } finally {
    node.testing = false
    render()
  }
}

function resolveParameterValue(nodeId, param) {
  const connection = getConnectionForTarget(nodeId, `param:${param.id}`)

  if (!connection) {
    return param.value
  }

  return resolveSourceValue(connection.source)
}

function stringifyParameterValue(value) {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return JSON.stringify(value)
}

function isFormControl(target) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
  )
}

function mutateControl(target, eventType = 'input') {
  if (!isFormControl(target)) {
    return
  }

  const profileId = target.dataset.profileId
  const profileField = target.dataset.profileField

  if (profileId && profileField && PROFILE_FIELDS.includes(profileField)) {
    const profile = getProfile(profileId)

    if (profile) {
      profile[profileField] = target.value
      if (profileField === 'token') {
        profile.tokenDirty = true

        if (eventType === 'change') {
          queueProfileSave()
        }

        return
      }
      queueProfileSave()
    }

    return
  }

  const nodeId = target.dataset.nodeId
  const nodeField = target.dataset.nodeField

  if (nodeId && nodeField && API_NODE_FIELDS.includes(nodeField)) {
    const node = getNode(nodeId)

    if (node && node.type === 'api') {
      node[nodeField] = target.value
      if (nodeField === 'profileId') {
        node.lastTest = null
      }

      if (target instanceof HTMLSelectElement || eventType === 'change') {
        render({ preserveFocus: true })
      }
    }

    return
  }

  const startFieldId = target.dataset.startFieldId
  const startFieldField = target.dataset.startFieldField

  if (startFieldId && startFieldField && START_FIELD_FIELDS.includes(startFieldField)) {
    const startNode = getStartNode()
    const field = startNode?.fields.find((item) => item.id === startFieldId)

    if (field && startNode) {
      field[startFieldField] = target.value

      if (startFieldField === 'type') {
        field.defaultValue = field.type === 'boolean' ? 'false' : ''
        state.formValues[field.id] = field.type === 'boolean' ? false : field.defaultValue
      }

      if (startFieldField === 'defaultValue') {
        state.formValues[field.id] = field.type === 'boolean' ? field.defaultValue === 'true' : field.defaultValue
      }

      render({ preserveFocus: true })
    }

    return
  }

  const paramId = target.dataset.paramId
  const paramField = target.dataset.paramField

  if (nodeId && paramId && paramField && PARAM_FIELDS.includes(paramField)) {
    const node = getNode(nodeId)

    if (node && node.type === 'api') {
      const param = node.params.find((item) => item.id === paramId)

      if (param) {
        param[paramField] = target.value
      }
    }

    return
  }

  if (target.dataset.endField === 'columnsText') {
    const endNode = getEndNode()

    if (endNode) {
      endNode.columnsText = target.value

      if (eventType === 'change') {
        render({ preserveFocus: true })
      }
    }

    return
  }

  const formFieldId = target.dataset.formFieldId

  if (formFieldId) {
    const startNode = getStartNode()
    const field = startNode?.fields.find((item) => item.id === formFieldId)

    if (!field) {
      return
    }

    if (field.type === 'boolean' && target instanceof HTMLInputElement) {
      state.formValues[formFieldId] = target.checked
    } else {
      state.formValues[formFieldId] = target.value
    }

    return
  }
}

function handleAction(target) {
  const actionTarget = target.closest('[data-action]')

  if (!(actionTarget instanceof HTMLElement) && !(actionTarget instanceof SVGElement)) {
    return false
  }

  const action = actionTarget.getAttribute('data-action')

  if (!action) {
    return false
  }

  if (action === 'switch-tab') {
    state.activeTab = actionTarget.dataset.tab
    render()
    return true
  }

  if (action === 'dismiss-status') {
    clearStatus(actionTarget.dataset.statusTab)
    return true
  }

  if (action === 'add-profile') {
    state.profiles.push(createProfile())
    state.activeTab = 'servers'
    render()
    void persistProfiles()
    return true
  }

  if (action === 'remove-profile') {
    const profileId = actionTarget.dataset.profileId
    state.profiles = state.profiles.filter((profile) => profile.id !== profileId)

    for (const node of state.nodes) {
      if (node.type === 'api' && node.profileId === profileId) {
        node.profileId = ''
        node.lastTest = null
      }
    }

    render()
    void persistProfiles({ announce: true, successMessage: 'Removed the selected server profile.' })
    return true
  }

  if (action === 'clear-profile-token') {
    const profile = getProfile(actionTarget.dataset.profileId)

    if (profile) {
      profile.hasToken = false
      profile.token = ''
      profile.tokenDirty = true
      render()
      void persistProfiles({ announce: true, successMessage: 'Cleared the saved bearer token for this profile.' })
    }

    return true
  }

  if (action === 'set-query-view') {
    state.queryView = actionTarget.dataset.queryView
    renderPreservingPageScroll()
    return true
  }

  if (action === 'add-api-node') {
    state.activeTab = 'query-builder'
    state.queryView = 'nodes'
    state.nodes.push(createApiNode())
    setStatus('Added a query-builder API node.', 'success')
    return true
  }

  if (action === 'remove-node') {
    const nodeId = actionTarget.dataset.nodeId
    state.nodes = state.nodes.filter((node) => node.id !== nodeId)
    removeConnectionsForNode(nodeId)
    setStatus('Removed the selected API node.', 'success')
    return true
  }

  if (action === 'add-start-field') {
    const startNode = getStartNode()

    if (startNode) {
      const field = createStartField()
      startNode.fields.push(field)
      state.formValues[field.id] = ''
      setStatus('Added a start-node field.', 'success')
    }

    return true
  }

  if (action === 'toggle-start-field-visibility') {
    const startNode = getStartNode()
    const field = startNode?.fields.find((item) => item.id === actionTarget.dataset.fieldId)

    if (field) {
      field.visible = !field.visible
      setStatus(
        field.visible ? 'Field is visible on the Output View.' : 'Field is hidden from the Output View.',
        'success'
      )
    }

    return true
  }

  if (action === 'remove-start-field') {
    const fieldId = actionTarget.dataset.fieldId
    const startNode = getStartNode()

    if (startNode) {
      startNode.fields = startNode.fields.filter((field) => field.id !== fieldId)
      delete state.formValues[fieldId]
      state.connections = state.connections.filter(
        (connection) => !(connection.source.nodeId === 'start' && connection.source.handleKey === fieldId)
      )
      setStatus('Removed the selected start-node field.', 'success')
    }

    return true
  }

  if (action === 'add-param') {
    const node = getNode(actionTarget.dataset.nodeId)

    if (node && node.type === 'api') {
      node.params.push(createQueryParameter())
      setStatus('Added a query parameter row.', 'success')
    }

    return true
  }

  if (action === 'remove-param') {
    const node = getNode(actionTarget.dataset.nodeId)
    const paramId = actionTarget.dataset.paramId

    if (node && node.type === 'api' && node.params.length > 1) {
      node.params = node.params.filter((param) => param.id !== paramId)
      removeConnection(node.id, `param:${paramId}`)
      setStatus('Removed the selected query parameter.', 'success')
    } else {
      setStatus('Keep at least one query parameter row on the node.', 'error')
    }

    return true
  }

  if (action === 'remove-connection') {
    removeConnection(actionTarget.dataset.targetNodeId, actionTarget.dataset.targetHandleKey)
    setStatus('Removed the selected wire.', 'success')
    render()
    return true
  }

  if (action === 'test-node') {
    void testNode(actionTarget.dataset.nodeId)
    return true
  }

  if (action === 'save-query') {
    saveQueryToFile()
    return true
  }

  if (action === 'load-query') {
    const fileInput = document.getElementById('query-file-input')

    if (fileInput instanceof HTMLInputElement) {
      fileInput.click()
    }

    return true
  }

  if (action === 'reset-form-values') {
    const startNode = getStartNode()

    if (startNode) {
      for (const field of startNode.fields) {
        state.formValues[field.id] = field.type === 'boolean' ? field.defaultValue === 'true' : field.defaultValue
      }
      setStatus('Reset output-view field values to the configured defaults.', 'success')
    }

    return true
  }

  return false
}

appRoot.addEventListener('click', (event) => {
  const target = event.target

  if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) {
    return
  }

  if (handleAction(target)) {
    return
  }
})

appRoot.addEventListener('input', (event) => {
  mutateControl(event.target, 'input')
})

appRoot.addEventListener('change', (event) => {
  const target = event.target

  if (target instanceof HTMLInputElement && target.id === 'query-file-input' && target.files?.[0]) {
    loadQueryFromFile(target.files[0])
    target.value = ''
    return
  }

  mutateControl(target, 'change')
})

appRoot.addEventListener('pointerdown', (event) => {
  const target = event.target

  if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) {
    return
  }

  const outputHandle = target.closest('[data-direction="output"]')

  if (outputHandle instanceof HTMLElement) {
    const startPoint = getHandleCenter(outputHandle.dataset.nodeId, outputHandle.dataset.handleKey, 'output')

    if (startPoint) {
      wireDraft = {
        currentPoint: startPoint,
        source: {
          handleKey: outputHandle.dataset.handleKey,
          nodeId: outputHandle.dataset.nodeId
        },
        startPoint
      }
      updateWireLayer()
      event.preventDefault()
      return
    }
  }

  const dragHandle = target.closest('[data-drag-handle="true"]')
  const nodeSpace = document.getElementById('node-space')

  if (dragHandle instanceof HTMLElement && nodeSpace instanceof HTMLElement) {
    const nodeId = dragHandle.dataset.nodeId
    const node = getNode(nodeId)

    if (!node) {
      return
    }

    const point = getCanvasPoint(event, nodeSpace)

    dragState = {
      nodeId,
      offsetX: point.x - node.position.x,
      offsetY: point.y - node.position.y
    }

    event.preventDefault()
    return
  }

  if (!(nodeSpace instanceof HTMLElement)) {
    return
  }

  const panTarget = target.closest('#node-space')

  if (!(panTarget instanceof HTMLElement) || target.closest('.node') || isFormControl(target)) {
    return
  }

  panState = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    scrollLeft: nodeSpace.scrollLeft,
    scrollTop: nodeSpace.scrollTop
  }
  nodeSpace.classList.add('is-panning')

  event.preventDefault()
})

document.addEventListener('pointermove', (event) => {
  const nodeSpace = document.getElementById('node-space')

  if (wireDraft && nodeSpace instanceof HTMLElement) {
    const spaceRect = nodeSpace.getBoundingClientRect()
    wireDraft.currentPoint = {
      x: event.clientX - spaceRect.left + nodeSpace.scrollLeft,
      y: event.clientY - spaceRect.top + nodeSpace.scrollTop
    }
    updateWireLayer()
  }

  if (!dragState || !(nodeSpace instanceof HTMLElement)) {
    if (panState && nodeSpace instanceof HTMLElement) {
      nodeSpace.scrollLeft = panState.scrollLeft - (event.clientX - panState.pointerX)
      nodeSpace.scrollTop = panState.scrollTop - (event.clientY - panState.pointerY)
      updateWireLayer()
    }

    return
  }

  const node = getNode(dragState.nodeId)

  if (!node) {
    return
  }

  const point = getCanvasPoint(event, nodeSpace)
  node.position.x = Math.max(24, point.x - dragState.offsetX)
  node.position.y = Math.max(24, point.y - dragState.offsetY)
  updateNodeElementPosition(node.id)
})

document.addEventListener('pointerup', (event) => {
  if (wireDraft) {
    const target = event.target
    const inputHandle = target instanceof HTMLElement ? target.closest('[data-direction="input"]') : null

    if (inputHandle instanceof HTMLElement && inputHandle.dataset.nodeId && inputHandle.dataset.handleKey) {
      removeConnection(inputHandle.dataset.nodeId, inputHandle.dataset.handleKey)
      state.connections.push({
        id: `wire-${state.nextIds.wire++}`,
        source: wireDraft.source,
        target: {
          handleKey: inputHandle.dataset.handleKey,
          nodeId: inputHandle.dataset.nodeId
        }
      })
      resetNodeTestsReferencingSource(wireDraft.source.nodeId)
      setStatus(`Connected ${getSourceLabel(wireDraft.source)} to a new target.`, 'success')
    } else {
      render()
    }
  }

  dragState = null
  panState = null
  wireDraft = null
  const nodeSpace = document.getElementById('node-space')

  if (nodeSpace instanceof HTMLElement) {
    nodeSpace.classList.remove('is-panning')
  }

  updateWireLayer()
})

window.addEventListener('resize', () => {
  scheduleUpdateWireLayer()
})

appRoot.addEventListener('scroll', (event) => {
  const target = event.target

  if (target instanceof HTMLElement && target.id === 'node-space') {
    scheduleUpdateWireLayer()
  }
}, true)

void loadPersistedProfiles()
