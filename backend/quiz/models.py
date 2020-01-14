from django.db import models
from django.utils.text import slugify


class Topic(models.Model):
    title = models.CharField(unique=True, max_length=127)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(Topic, self).save(*args, **kwargs)

    def __str__(self):
        return self.title


class Question(models.Model):
    QUESTION_TYPE_CHOICES = (
        ("single", "Single choice question"),
        ("multiple", "Multiple choice question"),
    )
    topic = models.ForeignKey(Topic, related_name="questions", on_delete=models.CASCADE)
    body = models.TextField()
    question_type = models.CharField(choices=QUESTION_TYPE_CHOICES, max_length=63)

    def __str__(self):
        return self.body


class Choice(models.Model):
    question = models.ForeignKey(
        Question, related_name="choices", on_delete=models.CASCADE
    )
    body = models.CharField(max_length=255)
    is_answer = models.BooleanField(default=False)

    def __str__(self):
        return self.body
