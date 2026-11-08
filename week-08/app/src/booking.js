/**
 * Decision function for room availability.
 * Implements Acceptance Criteria AC1 - AC5.
 *
 * @param {Object} params
 * @param {number} params.start - Candidate start time in minutes from midnight (0..1440)
 * @param {number} params.end - Candidate end time in minutes from midnight (0..1440)
 * @param {number} params.now - Current time in minutes from midnight
 * @param {boolean} params.blocked - Whether the room is blocked
 * @param {Array<{start: number, end: number}>} params.bookings - Existing room bookings
 * @returns {boolean} true if available, false if unavailable
 */
export function canBook({ start, end, now, blocked, bookings }) {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
