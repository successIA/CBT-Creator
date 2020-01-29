def get_choice_data_with_non_empty_body(choice_data, serializer):
    if choice_data:
        choices = serializer(data=choice_data).initial_data
        return [ch for ch in choices if ch["body"]]
    return choice_data


def add_id_to_choice_data_without_id(choice_data, serializer):
    choice_data = serializer(data=choice_data).initial_data
    for ch in choice_data:
        if not ch.get("id"):
            ch["id"] = 0
    return choice_data
