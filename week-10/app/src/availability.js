/**
 * Pure availability check engine for Smart Campus Room Availability Checker.
 * Implements Acceptance Criteria AC1 - AC6.
 *
 * AC1: Accept candidate interval only when 0 <= start < end <= 1440 and start is after supplied current time.
 * AC2: Reject a booking longer than 120 minutes.
 * AC3: Reject the request when the selected room is blocked.
 * AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
 * AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
 * AC6: Give understandable validation feedback.
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

export function checkRoomAvailability(room, candidateStartMinutes, candidateEndMinutes, suppliedCurrentMinutes) {
  // AC1: Candidate interval bounds 0 <= start < end <= 1440
  if (candidateStartMinutes < 0 || candidateEndMinutes > 1440) {
    return {
      available: false,
      reason: 'Time interval must be within 00:00 and 24:00 (0 to 1440 minutes).'
    };
  }

  // AC1 & AC6: start must be strictly before end
  if (candidateStartMinutes >= candidateEndMinutes) {
    return {
      available: false,
      reason: 'Start time (' + formatMinutes(candidateStartMinutes) + ') must be strictly earlier than end time (' + formatMinutes(candidateEndMinutes) + ').'
    };
  }

  // AC1: start is after the supplied current time (start > current_time)
  if (candidateStartMinutes <= suppliedCurrentMinutes) {
    return {
      available: false,
      reason: 'Start time (' + formatMinutes(candidateStartMinutes) + ') must be strictly after the supplied current time (' + formatMinutes(suppliedCurrentMinutes) + ').'
    };
  }

  // AC2: Reject a booking longer than 120 minutes
  const duration = candidateEndMinutes - candidateStartMinutes;
  if (duration > 120) {
    return {
      available: false,
      reason: 'Booking duration (' + duration + ' min) exceeds maximum limit of 120 minutes (AC2).'
    };
  }

  // AC3: Reject request when the selected room is blocked
  if (room.isBlocked) {
    return {
      available: false,
      reason: 'Room ' + room.name + ' is blocked and unavailable for booking (AC3).'
    };
  }

  // AC4: Reject any interval that overlaps an existing booking; touching endpoints allowed
  // Overlap condition: candidateStart < existing.end && candidateEnd > existing.start
  const conflicting = room.bookings.find(b => candidateStartMinutes < b.end && candidateEndMinutes > b.start);
  if (conflicting) {
    return {
      available: false,
      reason: 'Requested interval overlaps with existing booking: ' + conflicting.title + ' (' + conflicting.timeStr + ').'
    };
  }

  // AC5: Clear Available decision without mutating booking records
  return {
    available: true,
    reason: 'The selected room is available for the requested time slot (' + duration + ' min).'
  };
}
