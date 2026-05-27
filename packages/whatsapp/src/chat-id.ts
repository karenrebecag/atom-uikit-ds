const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const LEN = 5;

export function generateChatId(): string {
  if (window.crypto?.getRandomValues) {
    const buf = new Uint8Array(LEN);
    window.crypto.getRandomValues(buf);
    let id = '';
    for (let i = 0; i < LEN; i++) id += CHARS.charAt(buf[i] % CHARS.length);
    return id;
  }

  let id = '';
  for (let i = 0; i < LEN; i++) id += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  return id;
}
