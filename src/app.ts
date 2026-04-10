export function renderApp(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Canvas API Console</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: Arial, Helvetica, sans-serif;
      }

      body {
        margin: 0;
        padding: 2rem;
        line-height: 1.5;
      }

      main {
        max-width: 52rem;
        margin: 0 auto;
      }

      section {
        margin-top: 1.5rem;
      }

      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Canvas API Console</h1>
      <p>
        This local-first app prepares your workstation, checks for updates when the repository is
        available, and opens the browser-based console on your device.
      </p>
      <section aria-labelledby="launch-command-heading">
        <h2 id="launch-command-heading">Single command</h2>
        <p>Run <code>npm run app</code> from the repository root any time you want to start the app.</p>
      </section>
      <section aria-labelledby="safety-heading">
        <h2 id="safety-heading">Security expectations</h2>
        <ul>
          <li>Canvas credentials stay on the local device.</li>
          <li>Requests and workflows remain inspectable before execution.</li>
          <li>Administrative data should be handled with privacy-conscious defaults.</li>
        </ul>
      </section>
    </main>
  </body>
</html>`;
}
