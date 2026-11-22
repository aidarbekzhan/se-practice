/**
 * Decision functions for room availability.
 * Implements Acceptance Criteria AC1 - AC5 and room checking F3, F5.
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
  return true;
}

/**
 * Checks availability for a specific room in the catalog against requested times.
 * Dispatches to canBook using the chosen room's own blocked status and bookings (F3, F5).
 *
 * @param {Array<Object>} rooms - Catalog of rooms
 * @param {string} roomId - Identifier of the room to check
 * @param {Object} request - Request details
 * @param {number} request.start - Requested start time in minutes from midnight
 * @param {number} request.end - Requested end time in minutes from midnight
 * @param {number} request.now - Current time in minutes from midnight
 * @returns {boolean} true if room exists and is available, false otherwise
 */
export function checkRoom(rooms, roomId, request) {
  if (!Array.isArray(rooms) || !roomId || !request) return false;
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  return canBook({
    start: request.start,
    end: request.end,
    now: request.now,
    blocked: room.blocked,
    bookings: room.bookings
  });
}
