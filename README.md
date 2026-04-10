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

## Development commands

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```
