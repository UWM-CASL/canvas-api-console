export function renderApp(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Canvas API Console</title>
    <link rel="stylesheet" href="/assets/browser-app.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/assets/browser-app.js"></script>
  </body>
</html>`;
}
