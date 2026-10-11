def can_book(start, end, now, blocked, existing):
    # AC3: The room is not blocked.
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440, and start > now.
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False

    # AC2: Duration is at most 120 minutes.
    if end - start > 120:
        return False

    # AC4: No overlap with an existing booking. Touching endpoints are allowed.
    for a, b in existing:
        if start <= b and end >= a:
            return False

    # AC5: Return True only when AC1-AC4 hold. Return False otherwise and never alter existing.
    return True
