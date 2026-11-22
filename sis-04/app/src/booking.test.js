import { describe, test, expect } from 'vitest';
import { canBook, checkRoom } from './booking';
import { filterRooms } from './filter';

describe('Smart Campus Room Availability Suite (Evolved)', () => {
  const defaultNow = 540; // 09:00
  const defaultBlocked = false;
  const getBookings = () => [{ start: 600, end: 660 }]; // 10:00 - 11:00

  // Fixed isolated catalog for test repeatability (not coupled to demo data)
  const TEST_ROOMS = [
    {
      id: 't-small',
      name: 'Small Focus Room',
      capacity: 4,
      equipment: ['whiteboard'],
      blocked: false,
      bookings: [{ start: 600, end: 660 }] // 10:00 - 11:00
    },
    {
      id: 't-standard',
      name: 'Standard Seminar Room',
      capacity: 12,
      equipment: ['projector', 'whiteboard'],
      blocked: false,
      bookings: [{ start: 720, end: 780 }] // 12:00 - 13:00
    },
    {
      id: 't-large',
      name: 'Large Lecture Hall',
      capacity: 40,
      equipment: ['projector', 'whiteboard', 'audio'],
      blocked: false,
      bookings: []
    },
    {
      id: 't-blocked',
      name: 'Maintenance Room',
      capacity: 20,
      equipment: ['projector'],
      blocked: true,
      bookings: []
    }
  ];

  test('T01 B3 AC4: candidate touching after existing booking (660-720)', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(true);
  });

  test('T02 AC1: candidate starts at current time (540-570)', () => {
    const result = canBook({
      start: 540,
      end: 570,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T03 AC1: zero duration candidate (720-720)', () => {
    const result = canBook({
      start: 720,
      end: 720,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T04 AC1: reversed time interval (750-720)', () => {
    const result = canBook({
      start: 750,
      end: 720,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T05 AC1: candidate interval past end of day (1380-1441)', () => {
    const result = canBook({
      start: 1380,
      end: 1441,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T06 B1 AC2: exactly 120 minutes booking (720-840)', () => {
    const result = canBook({
      start: 720,
      end: 840,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(true);
  });

  test('T07 B2 AC2: booking longer than 120 minutes (720-841)', () => {
    const result = canBook({
      start: 720,
      end: 841,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T08 AC4: candidate touching before existing booking (570-600)', () => {
    const result = canBook({
      start: 570,
      end: 600,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(true);
  });

  test('T09 B4 AC4: candidate partially overlapping existing booking (630-690)', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T10 AC4: candidate containing existing booking (570-690)', () => {
    const result = canBook({
      start: 570,
      end: 690,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T11 AC4: candidate inside existing booking (615-645)', () => {
    const result = canBook({
      start: 615,
      end: 645,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T12 AC4: candidate identical to existing booking (600-660)', () => {
    const result = canBook({
      start: 600,
      end: 660,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T13 AC3: booking request on blocked room (660-720)', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: defaultNow,
      blocked: true,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T14 AC4: candidate when room has empty bookings (630-690)', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: []
    });
    expect(result).toBe(true);
  });

  test('AC5: available request does not mutate bookings array', () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = JSON.stringify(bookings);
    const result = canBook({
      start: 660,
      end: 720,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings
    });
    expect(result).toBe(true);
    expect(JSON.stringify(bookings)).toEqual(before);
  });

  test('X1 AC1: candidate up to exact end of day boundary (1320-1440)', () => {
    const result = canBook({
      start: 1320,
      end: 1440,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(true);
  });

  test('X2 AC4: candidate touching two existing bookings simultaneously (660-720)', () => {
    const twoBookings = [
      { start: 600, end: 660 },
      { start: 720, end: 780 }
    ];
    const result = canBook({
      start: 660,
      end: 720,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: twoBookings
    });
    expect(result).toBe(true);
  });

  test('BUG-A: candidate touching existing booking on boundary must be available (660-720)', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: [{ start: 600, end: 660 }]
    });
    expect(result).toBe(true);
  });

  test('BUG-B: available non-overlapping candidate leaves bookings unmutated (720-780)', () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = JSON.stringify(bookings);
    const result = canBook({
      start: 720,
      end: 780,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings
    });
    expect(result).toBe(true);
    expect(JSON.stringify(bookings)).toEqual(before);
  });

  test('F1 B5: filterRooms capacity greater than or equal to attendees includes room at exact boundary', () => {
    const result = filterRooms(TEST_ROOMS, { attendees: 12, equipment: [] });
    const ids = result.map(r => r.id);
    expect(ids).toContain('t-standard');
    expect(ids).toContain('t-large');
    expect(ids).toContain('t-blocked');
    expect(ids).not.toContain('t-small');
  });

  test('F1 B6: filterRooms capacity one below attendees excludes room from results', () => {
    const result = filterRooms(TEST_ROOMS, { attendees: 13, equipment: [] });
    const ids = result.map(r => r.id);
    expect(ids).not.toContain('t-standard');
    expect(ids).toContain('t-large');
    expect(ids).toContain('t-blocked');
  });

  test('F2: filterRooms requires room to contain ALL selected equipment items', () => {
    const result = filterRooms(TEST_ROOMS, { attendees: 0, equipment: ['projector', 'whiteboard'] });
    const ids = result.map(r => r.id);
    expect(ids).toEqual(['t-standard', 't-large']);
  });

  test('F3: checkRoom always returns false for blocked room regardless of request time', () => {
    const result = checkRoom(TEST_ROOMS, 't-blocked', { start: 660, end: 720, now: defaultNow });
    expect(result).toBe(false);
  });

  test('F4: filterRooms returns empty list when no room satisfies required criteria', () => {
    const result = filterRooms(TEST_ROOMS, { attendees: 100, equipment: ['audio'] });
    expect(result).toEqual([]);
  });

  test('F5: checkRoom uses chosen room own bookings and evaluates room-specific conflicts', () => {
    // 10:00 - 11:00 (600-660) conflicts with t-small, but is available in t-large
    const resSmall = checkRoom(TEST_ROOMS, 't-small', { start: 600, end: 660, now: defaultNow });
    const resLarge = checkRoom(TEST_ROOMS, 't-large', { start: 600, end: 660, now: defaultNow });
    expect(resSmall).toBe(false);
    expect(resLarge).toBe(true);
  });

  test('INT: filterRooms narrows catalog and checkRoom validates slot on selected room', () => {
    const matched = filterRooms(TEST_ROOMS, { attendees: 10, equipment: ['projector'] });
    expect(matched.length).toBeGreaterThan(0);
    const selected = matched[0];
    const isAvailable = checkRoom(matched, selected.id, { start: 600, end: 660, now: defaultNow });
    // t-standard has bookings at 720-780, so 600-660 is available
    expect(isAvailable).toBe(true);
  });
});
