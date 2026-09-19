"""
Assumptions stated:
1. Marks must be numeric (int or float). In Python, bool should not be treated as int.
2. A mark is considered passing if mark >= pass_mark.
3. pass_rate is expressed as a percentage (0 to 100), rounded to 2 decimal places to match the example.
4. average is rounded to 2 decimal places when necessary.
5. Any invalid input (empty list, non-numeric value, or mark < 0 or > 100) immediately raises ValueError.
"""

def analyze_marks(marks, pass_mark=50):
    """
    Analyzes student marks and returns average, highest, lowest, and pass_rate in a dictionary.
    """
    if not isinstance(marks, (list, tuple)) or len(marks) == 0:
        raise ValueError("Marks collection cannot be empty.")

    clean_marks = []
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError(f"Non-numeric mark encountered: {mark}")
        if mark < 0 or mark > 100:
            raise ValueError(f"Mark out of valid range (0-100): {mark}")
        clean_marks.append(mark)

    total = sum(clean_marks)
    count = len(clean_marks)
    average = round(total / count, 2)
    highest = max(clean_marks)
    lowest = min(clean_marks)

    passed_count = sum(1 for m in clean_marks if m >= pass_mark)
    pass_rate = round((passed_count / count) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }


# AI-generated self-tests
def run_tests():
    print("Running Prompt C self-tests...")

    # 1. One mark
    res_one = analyze_marks([85], 50)
    assert res_one == {"average": 85.0, "highest": 85, "lowest": 85, "pass_rate": 100.0}

    # 2. Decimals
    res_dec = analyze_marks([49.5, 50.0], 50)
    assert res_dec == {"average": 49.75, "highest": 50.0, "lowest": 49.5, "pass_rate": 50.0}

    # 3. Custom pass_mark
    res_custom = analyze_marks([60, 70, 80], pass_mark=70)
    assert res_custom == {"average": 70.0, "highest": 80, "lowest": 60, "pass_rate": 66.67}

    # 4. Empty list
    try:
        analyze_marks([], 50)
        assert False, "Should have raised ValueError for empty list"
    except ValueError:
        pass

    # 5. Text value
    try:
        analyze_marks([40, "60"], 50)
        assert False, "Should have raised ValueError for text value"
    except ValueError:
        pass

    # 6. Below 0 or above 100
    try:
        analyze_marks([-5, 50], 50)
        assert False, "Should have raised ValueError for mark < 0"
    except ValueError:
        pass

    try:
        analyze_marks([50, 105], 50)
        assert False, "Should have raised ValueError for mark > 100"
    except ValueError:
        pass

    print("All 6 AI self-tests passed successfully.")


if __name__ == "__main__":
    run_tests()
