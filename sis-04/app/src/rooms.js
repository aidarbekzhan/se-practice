/**
 * Room Catalog for Smart Campus Room Availability Checker.
 * Implements F1-F5 room properties.
 *
 * Each room has:
 * - id: unique string identifier
 * - name: descriptive room name
 * - capacity: maximum number of attendees
 * - equipment: list of available equipment
 * - blocked: boolean maintenance/reserved status
 * - bookings: array of { start: number, end: number } in minutes after midnight
 */

export const ROOMS = [
  {
    id: 'room-101',
    name: 'Room 101 (Seminar Room)',
    capacity: 20,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [
      { start: 600, end: 660 } // 10:00 - 11:00
    ]
  },
  {
    id: 'room-102',
    name: 'Room 102 (Small Meeting Room)',
    capacity: 8,
    equipment: ['whiteboard', 'display'],
    blocked: false,
    bookings: [
      { start: 720, end: 840 } // 12:00 - 14:00
    ]
  },
  {
    id: 'room-201',
    name: 'Room 201 (Computer Lab)',
    capacity: 30,
    equipment: ['projector', 'whiteboard', 'computers'],
    blocked: false,
    bookings: [
      { start: 840, end: 960 } // 14:00 - 16:00
    ]
  },
  {
    id: 'room-202',
    name: 'Room 202 (Executive Conference Hall)',
    capacity: 50,
    equipment: ['projector', 'whiteboard', 'microphones', 'video-conference'],
    blocked: false,
    bookings: [
      { start: 600, end: 720 } // 10:00 - 12:00
    ]
  },
  {
    id: 'room-301',
    name: 'Room 301 (Maintenance / Storage)',
    capacity: 15,
    equipment: ['whiteboard'],
    blocked: true,
    bookings: []
  }
];
