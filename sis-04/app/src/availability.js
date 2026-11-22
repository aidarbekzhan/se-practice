/**
 * Time utility functions for Smart Campus Room Availability Checker.
 */

export function toMinutes(timeStr) {
  if (!timeStr) return -1;
  if (timeStr === '24:00') return 1440;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return -1;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return -1;
  return h * 60 + m;
}

export function formatMinutes(minutes) {
  if (minutes === 1440) return '24:00';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
