def is_correct_answer(real_choices, user_choices):
    real_answers = [ch.id for ch in real_choices if ch.is_answer is True]
    user_answers = [ch.id for ch in user_choices if ch.is_answer is True]
    return sorted(real_answers) == sorted(user_answers)


def get_real_question(user_question, questions):
    q_list = [q for q in questions if q.pk == user_question.pk]
    real_question = q_list[0] if q_list else None
    return real_question
