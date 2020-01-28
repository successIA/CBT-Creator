from django.urls import path

from .views import ScoreRetreiveView, TopicDetailView, TopicListView

urlpatterns = [
    path("", TopicListView.as_view(), name="topic-list"),
    path("topics/<slug:slug>/", TopicDetailView.as_view(), name="topic-detail"),
    path("topics/<slug:slug>/result/", ScoreRetreiveView.as_view(), name="result"),
]
