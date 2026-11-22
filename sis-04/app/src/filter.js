/**
 * Room filtering logic for Smart Campus Room Availability Checker.
 * Implements F1 and F2 requirements.
 *
 * F1: room capacity must be greater than or equal to requested attendees.
 * F2: room must contain ALL selected required equipment.
 *
 * @param {Array<Object>} rooms - List of rooms from catalog
 * @param {Object} criteria - Search criteria
 * @param {number} criteria.attendees - Minimum requested attendee count
 * @param {string[]} criteria.equipment - Array of required equipment items
 * @returns {Array<Object>} Filtered list of matching rooms
 */
export function filterRooms(rooms, criteria) {
  if (!Array.isArray(rooms)) return [];
  const attendees = typeof criteria?.attendees === 'number' ? criteria.attendees : 0;
  const equipment = Array.isArray(criteria?.equipment) ? criteria.equipment : [];

  return rooms.filter(room => {
    if (typeof room.capacity === 'number' && room.capacity < attendees) {
      return false;
    }
    if (equipment.length > 0) {
      const roomEquipment = Array.isArray(room.equipment) ? room.equipment : [];
      const hasAll = equipment.every(item => roomEquipment.includes(item));
      if (!hasAll) return false;
    }
    return true;
  });
}
