/** "12m" / "1h 12m" / "2d 3h" for the queue age. Bad / future dates → "—". */
export function formatQueueAge(enqueuedAt: string, now: number = Date.now()): string {
  const start = new Date(enqueuedAt).getTime();
  if (Number.isNaN(start)) return "—";
  const diffMinutes = Math.floor((now - start) / 60_000);
  if (diffMinutes < 0) return "—";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours < 24) return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}
