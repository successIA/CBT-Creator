from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView

from ..models import Choice, Question, Topic
from ..utils import get_real_question, is_correct_answer
from .serializers import (
    ChoiceListSerializer,
    QuestionCreateSerializer,
    QuestionListSerializer,
    QuestionRetrieveUpdateDestroySerializer,
    # TopicListSerializer,
    TopicSerializer,
)


# class TopicListView(generics.ListAPIView):
#     queryset = Topic.objects.all()
# serializer_class = TopicListSerializer


class ScoreRetreiveView(APIView):
    def post(self, request, *args, **kwargs):
        question_data = JSONParser().parse(request)
        topic = get_object_or_404(Topic, slug=kwargs["slug"])
        question_qs = topic.questions.prefetch_related("choices").all()

        # Use to checkmate a hacked payload which contains duplicate
        # questions with the same correct answers that will boost the
        # score of the user.
        checked_questions = []
        score = 0
        for question_data in question_data:
            serializer = QuestionListSerializer(data=question_data)
            if serializer.is_valid():
                user_choices = serializer.get_choices()
                user_question = Question(**serializer.validated_data)
                real_question = get_real_question(user_question, question_qs)
                if real_question:
                    if real_question not in checked_questions:
                        if is_correct_answer(real_question.choices.all(), user_choices):
                            score += 1
                            checked_questions.append(real_question)
                else:
                    return JsonResponse(serializer.errors, status=400)
            else:
                return JsonResponse(serializer.errors, status=400)
        return JsonResponse({"score": score}, status=200)


class TopicListCreateView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


class TopicRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"


class QuestionCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionCreateSerializer


class QuestionListView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionListSerializer

    def get_queryset(self):
        if self.kwargs.get("slug"):
            return Question.objects.filter(topic__slug=self.kwargs["slug"]).all()
        else:
            return Question.objects.all()


class QuestionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionRetrieveUpdateDestroySerializer


class ChoiceDestroyView(generics.DestroyAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceListSerializer
