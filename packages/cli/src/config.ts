import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface AtomConfig {
  tsx: boolean;
  framework: string;
  aliases: {
    components: string;
    styles: string;
    foundations: string;
  };
  registry: string;
}

export interface AuthConfig {
  token: string;
  expiresAt?: string;
}

const CONFIG_FILE = 'atom-uikit.json';
const AUTH_DIR = path.join(os.homedir(), '.atom-uikit');
const AUTH_FILE = path.join(AUTH_DIR, 'auth.json');

export const DEFAULT_CONFIG: AtomConfig = {
  tsx: true,
  framework: 'next',
  aliases: {
    components: 'src/components',
    styles: 'src/styles',
    foundations: 'src/styles/foundations',
  },
  registry: 'https://uikit.atomchat.io/api/r',
};

export function findConfigPath(): string | null {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, CONFIG_FILE);
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }
  return null;
}

export function readConfig(): AtomConfig | null {
  const configPath = findConfigPath();
  if (!configPath) return null;
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

export function writeConfig(config: AtomConfig): void {
  fs.writeFileSync(
    path.join(process.cwd(), CONFIG_FILE),
    JSON.stringify(config, null, 2) + '\n',
    'utf8',
  );
}

export function readAuth(): AuthConfig | null {
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  } catch {
    return null;
  }
}

export function writeAuth(auth: AuthConfig): void {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2) + '\n', {
    mode: 0o600,
  });
}

export function getToken(): string | null {
  // 1. Env var (CI/automation)
  const envKey = process.env.ATOM_REGISTRY_KEY;
  if (envKey) return envKey;

  // 2. Cached auth
  const auth = readAuth();
  return auth?.token ?? null;
}
