from django.urls import include, path

from .views import (
    ChoiceDestroyView,
    QuestionListCreateView,
    QuestionListView,
    QuestionRetrieveUpdateDestroyView,
    ScoreRetreiveView,
    TopicListCreateView,
    TopicListView,
    TopicRetrieveUpdateDestroyView,
)

urlpatterns = [
    # PUBLIC ROUTES
    path("", TopicListView.as_view(), name="topic-list"),
    path("topics/<slug:slug>/", QuestionListView.as_view(), name="question-list",),
    path("topics/<slug:slug>/result/", ScoreRetreiveView.as_view(), name="result"),

    # AUTH ROUTES
    path("auth/", TopicListCreateView.as_view(), name="topic-list-create"),
    path(
        "auth/topics/<slug:slug>/edit/",
        TopicRetrieveUpdateDestroyView.as_view(),
        name="topic-detail-edit-delete",
    ),
    path(
        "auth/topics/<slug:slug>/",
        QuestionListCreateView.as_view(),
        name="question-list-create",
    ),
    path(
        "auth/questions/<int:pk>/",
        QuestionRetrieveUpdateDestroyView.as_view(),
        name="question-detail-edit-delete",
    ),
    path("auth/choices/<int:pk>/", ChoiceDestroyView.as_view(), name="choice-delete"),
]
