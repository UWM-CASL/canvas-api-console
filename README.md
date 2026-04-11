# canvas-api-console

Local-first Canvas API Console for authorized administrators.

## Requirements

- Node.js 20 or newer
- npm (included with Node.js)

## Quick start

Clone the repository or download it as a zip, open a terminal in the project root, and run:

```bash
npm run app
```

On first launch, the script prepares the device by installing dependencies and building the app. On later launches, the same command:

- checks for fast-forward updates automatically when the project is a git checkout
- installs dependencies again when an update changes the project state or when dependencies are missing
- rebuilds the application
- starts the local server
- opens the app in the default browser

If the project was downloaded as a zip instead of cloned with git, the update check is skipped and the app still launches locally.

## Current UI

The local app now includes:

- a left navigation with **About**, **Servers**, and **Query Builder** tabs
- server profiles with host fields that persist locally and masked bearer-token inputs stored in the device keychain
- a draggable and pannable query-builder node workspace with start, query, and end nodes
- top tabs for node and output views inside Query Builder
- export and import support for sanitized `.query.json` wireframes

## UI conventions

The UI uses compact icon controls where the surrounding context already explains the action.

- icon-only controls must still provide tooltips
- icon-only controls must still provide accessible text for assistive technology
- icon meanings stay consistent across the app

Current icon mappings:

- plus: add/create
- open or folder: open/load/import
- save: save/export
- open eye: visible/show
- closed eye: hidden/hide
- trash: delete/remove

## Development commands

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```
