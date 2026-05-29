import { getToken, readConfig } from './config.js';

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  dependencies?: string[];
  files: Array<{
    path: string;
    type: string;
    content: string;
  }>;
}

export interface IndexItem {
  name: string;
  kind: string;
  framework: string;
  installGroup: string;
  title: string;
  description: string;
  registryDependencies?: string[];
}

function getRegistryUrl(): string {
  const config = readConfig();
  return config?.registry ?? 'https://uikit.atomchat.io/api/r';
}

function getHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) {
    throw new Error(
      'Not authenticated. Run: npx atom-uikit login',
    );
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchIndex(): Promise<IndexItem[]> {
  const url = `${getRegistryUrl()}/index.json`;
  const res = await fetch(url, { headers: getHeaders() });
  if (res.status === 401) throw new Error('Unauthorized. Run: npx atom-uikit login');
  if (!res.ok) throw new Error(`Registry error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchItem(name: string): Promise<RegistryItem> {
  const url = `${getRegistryUrl()}/${name}.json`;
  const res = await fetch(url, { headers: getHeaders() });
  if (res.status === 401) throw new Error('Unauthorized. Run: npx atom-uikit login');
  if (res.status === 404) throw new Error(`Component "${name}" not found in registry`);
  if (!res.ok) throw new Error(`Registry error: ${res.status} ${res.statusText}`);
  return res.json();
}
