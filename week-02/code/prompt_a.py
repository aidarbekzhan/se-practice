def analyze_student_marks(marks):
    """
    Analyzes student marks and prints summary statistics.
    """
    if not marks:
        print("No marks provided.")
        return None

    total_students = len(marks)
    total_score = sum(marks)
    average_score = total_score / total_students
    highest_score = max(marks)
    lowest_score = min(marks)

    # Determine grade categories
    passed = [m for m in marks if m >= 50]
    failed = [m for m in marks if m < 50]
    pass_rate = (len(passed) / total_students) * 100

    print(f"Total Students: {total_students}")
    print(f"Average Score: {average_score:.2f}")
    print(f"Highest Score: {highest_score}")
    print(f"Lowest Score: {lowest_score}")
    print(f"Pass Rate: {pass_rate:.1f}%")

    return {
        "total": total_score,
        "average": round(average_score, 2),
        "highest": highest_score,
        "lowest": lowest_score,
        "pass_rate": round(pass_rate, 2),
    }


if __name__ == "__main__":
    sample_marks = [75, 82, 45, 90, 60, 38, 50]
    print("--- Marks Analysis ---")
    analyze_student_marks(sample_marks)
