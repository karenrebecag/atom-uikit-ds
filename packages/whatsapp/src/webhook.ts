import type { TrackingData } from './config';

export function sendWebhook(
  data: TrackingData,
  webhookUrl: string,
  companyToken: string,
  onError?: (error: unknown) => void
): void {
  const body = JSON.stringify(data);

  try {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`,
      },
      body,
      keepalive: true,
    }).catch((err) => {
      onError?.(err);
    });
  } catch (err) {
    // fetch threw synchronously (very rare)
    onError?.(err);
  }
}
