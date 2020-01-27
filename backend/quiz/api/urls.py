from django.urls import path

from .views import (
    ChoiceDestroyView,
    QuestionCreateView,
    TopicDetailView,
    QuestionRetrieveUpdateDestroyView,
    ScoreRetreiveView,
    TopicListCreateView,
    TopicListView,
    TopicRetrieveUpdateDestroyView,
)

urlpatterns = [
    # PUBLIC ROUTES
    path("", TopicListView.as_view(), name="topic-list"),
    path("topics/<slug:slug>/", TopicDetailView.as_view(), name="topic-detail"),
    path("topics/<slug:slug>/result/", ScoreRetreiveView.as_view(), name="result"),
    # AUTH ROUTES
    path("auth/", TopicListCreateView.as_view(), name="topic-list-create"),
    path(
        "auth/topics/<slug:slug>/",
        TopicRetrieveUpdateDestroyView.as_view(),
        name="topic-detail-edit-delete",
    ),
    path("auth/questions/", QuestionCreateView.as_view(), name="question-create",),
    path(
        "auth/questions/<int:pk>/",
        QuestionRetrieveUpdateDestroyView.as_view(),
        name="question-detail-edit-delete",
    ),
    path("auth/choices/<int:pk>/", ChoiceDestroyView.as_view(), name="choice-delete"),
]
