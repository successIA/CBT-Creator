from rest_framework import serializers


def validate_choice_and_question_type(data):
    choice_data = data["choices"]
    if not choice_data:
        raise serializers.ValidationError("Empty choices field")
    if len(choice_data) < 2:
        raise serializers.ValidationError("A question must have at least two choices")
    answer_count = len([c_d for c_d in choice_data if c_d["is_answer"]])
    if not answer_count:
        raise serializers.ValidationError("You must select a correct answer")
    elif answer_count > 1 and data["question_type"] == "single":
        raise serializers.ValidationError(
            "A single type question can only have one valid answer"
        )
    return data
