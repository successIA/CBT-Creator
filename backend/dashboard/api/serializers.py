from django.db import transaction

from rest_framework import serializers

from quiz.models import Choice, Question, Topic

from .validators import validate_choice_and_question_type


class ChoiceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=False, write_only=False, required=False)

    class Meta:
        model = Choice
        fields = ["id", "body", "is_answer"]


class QuestionListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=False, write_only=False, required=False)
    topic = serializers.SlugRelatedField(
        slug_field="slug", queryset=Topic.objects.all()
    )
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Question
        fields = ["topic", "id", "body", "question_type", "choices"]

    def get_choices(self):
        choice_data_list = self.validated_data.pop("choices")
        return [Choice(**data) for data in choice_data_list]


class TopicListCreateSerializer(serializers.HyperlinkedModelSerializer):
    slug = serializers.SlugField(read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name="topic-detail-edit-delete",
        lookup_field="slug",
        lookup_url_kwarg="slug",
        read_only=True,
    )

    class Meta:
        model = Topic
        fields = ["slug", "title", "url"]


class TopicDetailSerializer(serializers.HyperlinkedModelSerializer):
    questions = QuestionListSerializer(many=True, read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name="topic-detail-edit-delete",
        lookup_field="slug",
        lookup_url_kwarg="slug",
        read_only=True,
    )

    class Meta:
        model = Topic
        fields = ["slug", "title", "questions", "url"]


class ChoiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "body", "is_answer"]


class QuestionCreateSerializer(serializers.HyperlinkedModelSerializer):
    topic = serializers.SlugRelatedField(
        slug_field="slug", queryset=Topic.objects.all()
    )
    choices = ChoiceCreateSerializer(many=True, required=True)
    url = serializers.HyperlinkedIdentityField(
        view_name="question-detail-edit-delete",
        lookup_field="pk",
        lookup_url_kwarg="pk",
        read_only=True,
    )

    class Meta:
        model = Question
        fields = ["topic", "id", "body", "question_type", "choices", "url"]

    def validate(self, data):
        choice_data = data["choices"]
        if not choice_data:
            raise serializers.ValidationError("Empty choices field")
        if len(choice_data) < 2:
            raise serializers.ValidationError(
                "A question must have at least two choices"
            )
        answer_count = len([c_d for c_d in choice_data if c_d["is_answer"]])
        if not answer_count:
            raise serializers.ValidationError("You must select a correct answer")
        elif answer_count > 1 and data["question_type"] == "single":
            raise serializers.ValidationError(
                "A single type question can only have one valid answer"
            )
        return data

    def create(self, validated_data):
        choice_data_list = validated_data.pop("choices")
        with transaction.atomic():
            question = Question.objects.create(**validated_data)
            choice_list = [
                Choice(question=question, **choice_data)
                for choice_data in choice_data_list
            ]
            Choice.objects.bulk_create(choice_list)
        return question


class QuestionRetrieveUpdateDestroySerializer(serializers.ModelSerializer):
    topic = serializers.SlugRelatedField(
        slug_field="slug", queryset=Topic.objects.all()
    )
    choices = ChoiceSerializer(many=True)
    url = serializers.HyperlinkedIdentityField(
        view_name="question-detail-edit-delete",
        lookup_field="pk",
        lookup_url_kwarg="pk",
        read_only=True,
    )

    class Meta:
        model = Question
        fields = ["topic", "id", "body", "question_type", "choices", "url"]

    def validate(self, data):
        return validate_choice_and_question_type(data)

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance.body = validated_data["body"]
            instance.question_type = validated_data["question_type"]
            instance.save(update_fields=["body", "question_type"])
            choice_data_list = validated_data["choices"]
            self._perform_orphaned_choice_delete(instance, choice_data_list)
            self._perform_choice_bulk_update(instance, choice_data_list)
            self._perform_choice_bulk_create(instance, choice_data_list)
        return instance

    def _perform_choice_bulk_update(self, instance, choice_data_list):
        choice_data_list = [ch for ch in choice_data_list if ch.get("id")]
        if choice_data_list:
            choice_list = [
                Choice(question=instance, **choice_data)
                for choice_data in choice_data_list
            ]
            Choice.objects.bulk_update(choice_list, ["body", "is_answer"])
        # else:
        #     instance.choices.all().delete()  # the question type have been changed

    def _perform_choice_bulk_create(self, instance, choice_data_list):
        choice_data_list = [ch for ch in choice_data_list if not ch.get("id")]

        # Any pk field set can may lead to integrity constraint error
        # We have to ensure that they are not present by popping them out here.
        [ch.pop("pk", None) for ch in choice_data_list]
        [ch.pop("id", None) for ch in choice_data_list]

        choice_list = [
            Choice(question=instance, **choice_data) for choice_data in choice_data_list
        ]
        Choice.objects.bulk_create(choice_list)

    def _perform_orphaned_choice_delete(self, instance, choice_data_list):
        all_choice_ids = {ch.pk for ch in instance.choices.all()}
        choice_id_data = {ch["id"] for ch in choice_data_list if ch.get("id")}
        orphaned_choice_ids = all_choice_ids - choice_id_data
        Choice.objects.filter(
            question__pk=instance.pk, pk__in=orphaned_choice_ids
        ).delete()
