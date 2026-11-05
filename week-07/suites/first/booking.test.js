import { describe, test, expect } from 'vitest';
import { canBook } from './booking';

describe('canBook room availability suite (first generated)', () => {
  const defaultNow = 540;
  const defaultBlocked = false;
  const getBookings = () => [{ start: 600, end: 660 }];

  test('T01 AC4: candidate touching after existing booking (660-720)', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBeTruthy();
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

  test('T06 AC2: exactly 120 minutes booking (720-840)', () => {
    const result = canBook({
      start: 720,
      end: 840,
      now: defaultNow,
      blocked: defaultBlocked,
      bookings: getBookings()
    });
    expect(result).toBe(false);
  });

  test('T07 AC2: booking longer than 120 minutes (720-841)', () => {
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

  test('T09 AC4: candidate partially overlapping existing booking (630-690)', () => {
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
    const bookings = getBookings();
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
});
