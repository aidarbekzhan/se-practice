import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    # --- Six table cases from the task specification ---

    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_overlap_rejected(self):
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_blocked_room_rejected(self):
        result = can_book(660, 720, 540, True, [(600, 660)])
        self.assertIs(result, False)

    def test_exactly_two_hours_allowed(self):
        result = can_book(720, 840, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_over_two_hours_rejected(self):
        result = can_book(720, 841, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_starts_now_rejected(self):
        result = can_book(540, 570, 540, False, [(600, 660)])
        self.assertIs(result, False)

    # --- Additional cases: zero-length and reversed times ---

    def test_zero_length_rejected(self):
        result = can_book(700, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_reversed_times_rejected(self):
        result = can_book(720, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    # --- Additional cases: day bounds ---

    def test_ends_exactly_at_day_bound_allowed(self):
        result = can_book(1380, 1440, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_ends_after_day_bound_rejected(self):
        result = can_book(1380, 1441, 540, False, [(600, 660)])
        self.assertIs(result, False)

    # --- Additional cases: empty existing and multiple bookings ---

    def test_empty_existing_allowed(self):
        result = can_book(600, 660, 540, False, [])
        self.assertIs(result, True)

    def test_multiple_bookings_overlap_second(self):
        result = can_book(720, 780, 540, False, [(600, 660), (700, 760)])
        self.assertIs(result, False)

    # --- Additional cases: unchanged input list ---

    def test_existing_list_remains_unmodified(self):
        existing = [(900, 960), (600, 660)]
        snapshot = list(existing)
        result = can_book(780, 840, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, snapshot)

    # --- Additional cases: other overlap relationships ---

    def test_touching_start_is_allowed(self):
        result = can_book(570, 600, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_inside_existing_booking_rejected(self):
        result = can_book(615, 645, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_contains_existing_booking_rejected(self):
        result = can_book(570, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)


if __name__ == "__main__":
    unittest.main()
