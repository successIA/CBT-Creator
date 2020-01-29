from rest_framework import generics

from quiz.models import Question, Topic

from .serializers import (
    ChoiceCreateSerializer,
    ChoiceSerializer,
    QuestionCreateSerializer,
    QuestionRetrieveUpdateDestroySerializer,
    TopicDetailSerializer,
    TopicListCreateSerializer,
)
from .utils import (
    add_id_to_choice_data_without_id,
    get_choice_data_with_non_empty_body,
)


class TopicListCreateView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicListCreateSerializer


class TopicRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"


class QuestionCreateView(generics.CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionCreateSerializer

    def create(self, request, *args, **kwargs):
        request.data["choices"] = get_choice_data_with_non_empty_body(
            request.data["choices"], ChoiceCreateSerializer
        )
        return super(QuestionCreateView, self).create(request, *args, **kwargs)


class QuestionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionRetrieveUpdateDestroySerializer

    def update(self, request, *args, **kwargs):
        request.data["choices"] = get_choice_data_with_non_empty_body(
            request.data["choices"], ChoiceSerializer
        )
        request.data["choices"] = add_id_to_choice_data_without_id(
            request.data["choices"], ChoiceSerializer
        )
        return super(QuestionRetrieveUpdateDestroyView, self).update(
            request, *args, **kwargs
        )
