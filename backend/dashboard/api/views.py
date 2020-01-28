from rest_framework import generics

from quiz.models import Choice, Question, Topic

from .serializers import (
    ChoiceSerializer,
    QuestionCreateSerializer,
    QuestionRetrieveUpdateDestroySerializer,
    TopicDetailSerializer,
    TopicListCreateSerializer,
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


class QuestionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionRetrieveUpdateDestroySerializer


class ChoiceDestroyView(generics.DestroyAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
