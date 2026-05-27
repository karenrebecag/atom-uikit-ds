export type ChatIdStrategy = 'url' | 'referenceCode';

export function buildMessage(
  chatId: string,
  message: string,
  strategy: ChatIdStrategy
): string {
  if (strategy === 'referenceCode') {
    return `${message}\n\nCodigo de referencia: ${chatId}`;
  }

  // Default: url strategy
  const pageUrl = window.location.origin + window.location.pathname;
  const sep = pageUrl.includes('?') ? '&' : '?';
  const refUrl = `${pageUrl}${sep}wci=${chatId}`;
  return `${message}\n\nEnlace de referencia: ${refUrl}`;
}
