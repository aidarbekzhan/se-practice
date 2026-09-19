def analyze_marks(marks, pass_mark=50):
    """
    Analyzes student marks and returns a dictionary with summary statistics.

    Parameters:
        marks (sequence): Collection of numeric marks from 0 to 100.
        pass_mark (int or float): Passing mark threshold (default 50).

    Returns:
        dict: A dictionary with keys 'average', 'highest', 'lowest', and 'pass_rate'.

    Raises:
        ValueError: If marks is empty, contains non-numeric values, boolean types,
                    values outside 0-100, or if pass_mark is invalid.
    """
    if marks is None:
        raise ValueError("marks cannot be None")

    try:
        marks_list = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable sequence")

    if not marks_list:
        raise ValueError("marks cannot be empty")

    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
        raise ValueError("pass_mark must be a numeric value")

    if not (0 <= pass_mark <= 100):
        raise ValueError("pass_mark must be between 0 and 100")

    for m in marks_list:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"Invalid non-numeric mark: {m}")
        if not (0 <= m <= 100):
            raise ValueError(f"Mark out of range [0, 100]: {m}")

    count = len(marks_list)
    total = sum(marks_list)
    average = round(total / count, 2)
    highest = max(marks_list)
    lowest = min(marks_list)

    passing_count = sum(1 for m in marks_list if m >= pass_mark)
    pass_rate = round((passing_count / count) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }
