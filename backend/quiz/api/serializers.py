from django.db import transaction

from rest_framework import serializers

from ..models import Choice, Question, Topic


class TopicListSerializer(serializers.HyperlinkedModelSerializer):
    question_list_url = serializers.HyperlinkedIdentityField(
        view_name="question-list",
        lookup_field="slug",
        lookup_url_kwarg="slug",
        read_only=True,
    )

    class Meta:
        model = Topic
        fields = ["title", "question_list_url"]


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


class TopicSerializer(serializers.HyperlinkedModelSerializer):
    slug = serializers.SlugField(read_only=True)
    question_list_create_url = serializers.HyperlinkedIdentityField(
        view_name="question-list-create",
        lookup_field="slug",
        lookup_url_kwarg="slug",
        read_only=True,
    )
    url = serializers.HyperlinkedIdentityField(
        view_name="topic-detail-edit-delete",
        lookup_field="slug",
        lookup_url_kwarg="slug",
        read_only=True,
    )

    class Meta:
        model = Topic
        fields = ["slug", "title", "question_list_create_url", "url"]


class ChoiceListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "body", "is_answer"]


class QuestionListCreateSerializer(serializers.HyperlinkedModelSerializer):
    topic = serializers.SlugRelatedField(
        slug_field="slug", queryset=Topic.objects.all()
    )
    choices = ChoiceListCreateSerializer(many=True)
    url = serializers.HyperlinkedIdentityField(
        view_name="question-detail-edit-delete",
        lookup_field="pk",
        lookup_url_kwarg="pk",
        read_only=True,
    )

    class Meta:
        model = Question
        fields = ["topic", "id", "body", "question_type", "choices", "url"]

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

    def _perform_choice_bulk_update(self, instance, choice_data_list):
        choice_data_list = [ch for ch in choice_data_list if ch.get("id")]
        if choice_data_list:
            choice_list = [
                Choice(question=instance, **choice_data)
                for choice_data in choice_data_list
            ]
            Choice.objects.bulk_update(choice_list, ["body", "is_answer"])
        else:
            instance.choices.all().delete() # the question type have been changed
    
    def update(self, instance, validated_data):
        with transaction.atomic():
            instance.body = validated_data["body"]
            instance.question_type = validated_data["question_type"]
            instance.save(update_fields=["body", "question_type"])
            choice_data_list = validated_data["choices"]
            self._perform_choice_bulk_update(instance, choice_data_list)
            self._perform_choice_bulk_create(instance, choice_data_list)
        return instance
