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
  // AC1: Accept a candidate interval only when 0 <= start < end <= 1440 and start is after supplied current time
  if (start < 0 || end > 1440) {
    return false;
  }
  if (start >= end) {
    return false;
  }
  if (start <= now) {
    return false;
  }

  // AC2: Reject a booking longer than 120 minutes
  if (end - start > 120) {
    return false;
  }

  // AC3: Reject the request when the selected room is blocked
  if (blocked) {
    return false;
  }

  // AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed
  if (bookings && bookings.length > 0) {
    const hasOverlap = bookings.some(b => start < b.end && end > b.start);
    if (hasOverlap) {
      return false;
    }
  }

  // AC5: Clear Available decision without changing the existing booking data
  return true;
}
