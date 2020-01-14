from django.contrib import admin

from .models import Choice, Question, Topic

admin.site.register(Topic)
admin.site.register(Question)
admin.site.register(Choice)
