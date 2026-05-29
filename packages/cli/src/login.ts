import http from 'node:http';
import crypto from 'node:crypto';
import { writeAuth } from './config.js';

const REGISTRY_BASE = 'https://uikit.atomchat.io';
const AUTH_ENDPOINT = '/api/auth/mcp-token';

/**
 * Opens browser for Clerk OAuth, receives code via localhost callback,
 * exchanges code for JWT, and saves to ~/.atom-uikit/auth.json.
 *
 * Reuses the existing /api/auth/mcp-token endpoint from the docs app.
 */
export async function login(): Promise<void> {
  const state = crypto.randomUUID();

  const { port, token } = await new Promise<{ port: number; token: string }>(
    (resolve, reject) => {
      const server = http.createServer(async (req, res) => {
        const url = new URL(req.url!, `http://127.0.0.1`);

        if (url.pathname !== '/callback') {
          res.writeHead(404);
          res.end();
          return;
        }

        const code = url.searchParams.get('code');
        const returnedState = url.searchParams.get('state');

        if (returnedState !== state) {
          res.writeHead(400);
          res.end('State mismatch');
          server.close();
          reject(new Error('State mismatch — possible CSRF'));
          return;
        }

        if (!code) {
          res.writeHead(400);
          res.end('Missing code');
          server.close();
          reject(new Error('No code received'));
          return;
        }

        // Exchange code for token
        try {
          const exchange = await fetch(`${REGISTRY_BASE}${AUTH_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          if (!exchange.ok) {
            throw new Error(`Token exchange failed: ${exchange.status}`);
          }

          const { token } = await exchange.json() as { token: string };

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html><body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0b;color:#fafafa">
              <div style="text-align:center">
                <h2>Authenticated</h2>
                <p>You can close this tab and return to the terminal.</p>
              </div>
            </body></html>
          `);

          server.close();
          resolve({ port: serverPort, token });
        } catch (err) {
          res.writeHead(500);
          res.end('Token exchange failed');
          server.close();
          reject(err);
        }
      });

      let serverPort = 0;

      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (!addr || typeof addr === 'string') {
          reject(new Error('Failed to start callback server'));
          return;
        }
        serverPort = addr.port;

        const loginUrl = `${REGISTRY_BASE}${AUTH_ENDPOINT}?port=${serverPort}&state=${encodeURIComponent(state)}`;

        console.log('\n  Opening browser for authentication...\n');
        console.log(`  If it doesn't open, visit:\n  ${loginUrl}\n`);

        // Open browser (cross-platform)
        import('node:child_process').then(({ exec }) => {
          const cmd =
            process.platform === 'darwin' ? 'open' :
            process.platform === 'win32' ? 'start' : 'xdg-open';
          exec(`${cmd} "${loginUrl}"`);
        });
      });

      // Timeout after 2 minutes
      setTimeout(() => {
        server.close();
        reject(new Error('Login timed out (2 minutes)'));
      }, 120_000);
    },
  );

  writeAuth({ token });
  console.log('  Authenticated. Token saved to ~/.atom-uikit/auth.json\n');
}
