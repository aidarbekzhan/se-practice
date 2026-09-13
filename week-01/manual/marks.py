import sys


def parse_and_filter_marks(raw_input_data):
    """
    Parses a string or list of raw mark tokens and filters valid marks (0-100).
    Non-numeric strings, negative numbers, and numbers > 100 are ignored.
    """
    if isinstance(raw_input_data, str):
        tokens = [token.strip() for token in raw_input_data.split(",")]
    else:
        tokens = list(raw_input_data)

    valid_marks = []
    for token in tokens:
        if token is None:
            continue
        cleaned = str(token).strip()
        if not cleaned:
            continue
        try:
            val = float(cleaned)
            # Valid marks are strictly between 0 and 100 inclusive
            if 0 <= val <= 100:
                # If integer equivalent, store as int for clean display
                if val.is_integer():
                    valid_marks.append(int(val))
                else:
                    valid_marks.append(val)
        except ValueError:
            # Non-numeric tokens (e.g., 'abc', 'xyz') are safely ignored
            continue

    return valid_marks


def calculate_statistics(valid_marks):
    """
    Computes statistics for a list of valid marks.
    Returns a dictionary with stats, or None if no valid marks exist.
    """
    if not valid_marks:
        return None

    count = len(valid_marks)
    total = sum(valid_marks)
    average = total / count
    highest = max(valid_marks)
    lowest = min(valid_marks)

    passing_marks = [m for m in valid_marks if m >= 50]
    pass_rate = (len(passing_marks) / count) * 100.0

    return {
        "valid_count": count,
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


def format_statistics(stats):
    """
    Formats the statistics according to the required specification.
    """
    if stats is None:
        return "No valid marks provided."

    return (
        f"Valid marks: {stats['valid_count']}\n"
        f"Average: {stats['average']:.2f}\n"
        f"Highest: {stats['highest']}\n"
        f"Lowest: {stats['lowest']}\n"
        f"Pass rate: {stats['pass_rate']:.1f}%"
    )


def run_tests():
    """
    Runs the four required test cases from the specification and validates outputs.
    """
    test_cases = [
        {
            "case": "A",
            "input": "85, 23, 45, 90, 92",
            "expected_valid": 5,
            "expected_avg": 67.00,
            "expected_high": 92,
            "expected_low": 23,
            "expected_pass_rate": 60.0,
            "expect_empty": False,
        },
        {
            "case": "B",
            "input": "88, 47, -5, 101, abc, 73, 50, , 100",
            "expected_valid": 5,
            "expected_avg": 71.60,
            "expected_high": 100,
            "expected_low": 47,
            "expected_pass_rate": 80.0,
            "expect_empty": False,
        },
        {
            "case": "C",
            "input": "10, 20, 30",
            "expected_valid": 3,
            "expected_avg": 20.00,
            "expected_high": 30,
            "expected_low": 10,
            "expected_pass_rate": 0.0,
            "expect_empty": False,
        },
        {
            "case": "D",
            "input": "abc, , xyz",
            "expect_empty": True,
        },
    ]

    print("========================================")
    print(" Running Week 01 Specification Tests")
    print("========================================")
    all_passed = True

    for tc in test_cases:
        print(f"\n--- Test Case {tc['case']} ---")
        print(f"Input: {tc['input']}")
        marks = parse_and_filter_marks(tc["input"])
        stats = calculate_statistics(marks)
        output_str = format_statistics(stats)
        print("Output:")
        print(output_str)

        if tc["expect_empty"]:
            passed = stats is None and "No valid marks" in output_str
        else:
            passed = (
                stats is not None
                and stats["valid_count"] == tc["expected_valid"]
                and abs(stats["average"] - tc["expected_avg"]) < 1e-4
                and stats["highest"] == tc["expected_high"]
                and stats["lowest"] == tc["expected_low"]
                and abs(stats["pass_rate"] - tc["expected_pass_rate"]) < 1e-4
            )

        if passed:
            print(f"Status: PASS [OK]")
        else:
            print(f"Status: FAIL [Mismatch]")
            all_passed = False

    print("\n========================================")
    if all_passed:
        print(" ALL 4 TEST CASES PASSED SUCCESSFULLY!")
    else:
        print(" SOME TEST CASES FAILED.")
    print("========================================")
    return all_passed


def main():
    if len(sys.argv) > 1:
        if sys.argv[1] in ("--test", "-t", "test"):
            success = run_tests()
            sys.exit(0 if success else 1)
        raw_input = " ".join(sys.argv[1:])
    else:
        print("Enter student marks separated by commas (or press Enter for default Case A):")
        try:
            line = input().strip()
            raw_input = line if line else "85, 23, 45, 90, 92"
        except (EOFError, KeyboardInterrupt):
            raw_input = "85, 23, 45, 90, 92"

    valid_marks = parse_and_filter_marks(raw_input)
    stats = calculate_statistics(valid_marks)
    print("\n" + format_statistics(stats))


if __name__ == "__main__":
    main()
