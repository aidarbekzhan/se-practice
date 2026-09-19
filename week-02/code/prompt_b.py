def analyze_marks(marks, pass_mark=50):
    """
    Analyzes student marks and calculates average, highest, lowest, and pass_rate.

    :param marks: List of numeric marks (0 to 100)
    :param pass_mark: Passing threshold, default 50
    :return: Dictionary with 'average', 'highest', 'lowest', 'pass_rate'
    :raises ValueError: If marks is empty, contains non-numeric, or out-of-range values
    """
    if not marks:
        raise ValueError("The marks list cannot be empty.")

    for mark in marks:
        if not isinstance(mark, (int, float)):
            raise ValueError(f"Invalid non-numeric mark found: {mark}")
        if mark < 0 or mark > 100:
            raise ValueError(f"Mark out of valid range (0-100): {mark}")

    total = sum(marks)
    count = len(marks)
    average = total / count
    highest = max(marks)
    lowest = min(marks)

    passed_count = sum(1 for mark in marks if mark >= pass_mark)
    pass_rate = (passed_count / count) * 100

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }
