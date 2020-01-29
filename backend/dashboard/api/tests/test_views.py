import json

from django.shortcuts import reverse

from rest_framework.test import APITestCase

from quiz.models import Choice, Question, Topic


class TopicListCreateViewTest(APITestCase):
    def setUp(self):
        Topic.objects.create(title="Python Data Types")
        Topic.objects.create(title="Python Tuples")
        self.topic_list_create_url = reverse("topic-list-create")

    def test_list(self):
        response = self.client.get(self.topic_list_create_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Python Data Types")
        self.assertContains(response, "Python Tuples")

    def test_create(self):
        post_data = {"title": "Python Decorators"}
        response = self.client.post(self.topic_list_create_url, post_data)
        self.assertEqual(response.status_code, 201)
        read_data = json.loads(response.content)
        expected_data = {
            "slug": "python-decorators",
            "title": "Python Decorators",
            "url": "http://testserver/auth/topics/python-decorators/",
        }
        self.assertEqual(read_data, expected_data)
        self.assertEquals(Topic.objects.count(), 3)


class TopicRetrieveUpdateDestroyViewTest(APITestCase):
    def setUp(self):
        self.topic = Topic.objects.create(title="Python Data Types")
        self.question = Question.objects.create(
            topic=self.topic,
            body="Which of the is an integer in python?",
            question_type="single"
        )
        self.question_ch = Choice.objects.create(
            question=self.question, body="-2", is_answer=True
        )
        self.question_ch2 = Choice.objects.create(question=self.question, body="2.0")

        self.question2 = Question.objects.create(
            topic=self.topic,
            body="Select the choices that define a list correctly in python?",
            question_type="multiple"
        )
        self.question2_ch = Choice.objects.create(
            question=self.question2, body="A list is immutable", is_answer=False
        )
        self.question2_ch2 = Choice.objects.create(
            question=self.question2, body="A list is mutable", is_answer=True
        )
        self.question2_ch3 = Choice.objects.create(
            question=self.question2,
            body="A list is passed by reference",
            is_answer=True
        )
        self.detail_edit_delete_url = reverse(
            "topic-detail-edit-delete", kwargs={"slug": self.topic.slug}
        )

    def assert_topic_question_content(self, response):
        self.assertContains(response, "Which of the is an integer in python?")
        self.assertContains(response, "-2")
        self.assertContains(response, "2.0")

        self.assertContains(
            response,
            "Select the choices that define a list correctly in python?"
        )
        self.assertContains(response, "A list is immutable")
        self.assertContains(response, "A list is mutable")
        self.assertContains(response, "A list is passed by reference")

    def test_detail(self):
        response = self.client.get(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Python Data Types")
        self.assert_topic_question_content(response)

    def test_update(self):
        post_data = {"slug": self.topic.slug, "title": "Python Decorators"}
        response = self.client.put(self.detail_edit_delete_url, post_data)
        self.assertEqual(response.status_code, 200)
        topic = Topic.objects.get(slug="python-decorators")
        self.assertEqual("Python Decorators", topic.title)
        self.assertEqual("python-decorators", topic.slug)
        self.assert_topic_question_content(response)

    def test_delete(self):
        response = self.client.delete(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 204)
        self.assertEquals(Topic.objects.count(), 0)


class QuestionCreateTest(APITestCase):
    def setUp(self):
        self.topic = Topic.objects.create(title="Python Data Types")
        self.question_create_url = reverse(
            "question-create"
        )

    def test_create(self):
        previous_count = Question.objects.count()
        post_data = {
            "topic": self.topic.slug,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "body": "choice 1",
                    "is_answer": "true"
                },
                {
                    "body": "choice 2",
                    "is_answer": "false"
                }
            ]
        }
        response = self.client.post(self.question_create_url, post_data, format="json")
        self.assertEqual(response.status_code, 201)
        read_data = json.loads(response.content)
        expected_data = {
            "topic": self.topic.slug,
            "id": 1,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "id": 1,
                    "body": "choice 1",
                    "is_answer": True
                },
                {
                    "id": 2,
                    "body": "choice 2",
                    "is_answer": False
                }
            ],
            "url": "http://testserver/auth/questions/1/"
        }
        self.assertEqual(read_data, expected_data)
        self.assertEquals(Question.objects.count(), previous_count + 1)

    def test_create_with_invalid_choice_data(self):
        post_data = {
            "topic": self.topic.slug,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "body": "",
                    "is_answer": "true"
                },
                {
                    "body": "4",
                    "is_answer": "false"
                }
            ]
        }
        response = self.client.post(self.question_create_url, post_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "A question must have at least two choices",
            response.content.decode()
        )

    def test_create_with_choice_data_with_no_answer(self):
        post_data = {
            "topic": self.topic.slug,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "body": "45",
                    "is_answer": "false"
                },
                {
                    "body": "4",
                    "is_answer": "false"
                }
            ]
        }
        response = self.client.post(self.question_create_url, post_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "You must select a correct answer",
            response.content.decode()
        )

    def test_create_with_choice_data_with_two_answers_for_single_type_question(self):
        post_data = {
            "topic": self.topic.slug,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "body": "45",
                    "is_answer": "true"
                },
                {
                    "body": "4",
                    "is_answer": "true"
                }
            ]
        }
        response = self.client.post(self.question_create_url, post_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "A single type question can only have one valid answer",
            response.content.decode()
        )

    def test_create_with_choice_data_with_two_answers_for_multiple_type_question(self):
        post_data = {
            "topic": self.topic.slug,
            "body": "Random question?",
            "question_type": "multiple",
            "choices": [
                {
                    "body": "45",
                    "is_answer": "true"
                },
                {
                    "body": "4",
                    "is_answer": "true"
                }
            ]
        }
        response = self.client.post(self.question_create_url, post_data, format="json")
        self.assertEqual(response.status_code, 201)


class QuestionRetrieveUpdateDestroyViewTest(APITestCase):
    def setUp(self):
        self.topic = Topic.objects.create(title="Python Data Types")
        self.question = Question.objects.create(
            topic=self.topic,
            body="Which of the is an integer in python?",
            question_type="single"
        )
        self.question_ch = Choice.objects.create(
            question=self.question, body="-2", is_answer=True
        )
        self.question_ch2 = Choice.objects.create(question=self.question, body="2.0")

        self.detail_edit_delete_url = reverse(
            "question-detail-edit-delete", kwargs={"pk": self.question.pk}
        )

    def test_detail(self):
        response = self.client.get(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Which of the is an integer in python?")
        self.assertContains(response, "-2")
        self.assertContains(response, "2.0")

    def test_update(self):
        post_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question changed?",
            "question_type": "multiple",
            "choices": [
                {
                    "id": 1,
                    "body": "choice 1 changed",
                    "is_answer": "false"
                },
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": "true"
                },
                {
                    # "id": 0,
                    "body": "new choice",
                    "is_answer": "true"
                }
            ]
        }
        response = self.client.put(
            self.detail_edit_delete_url, post_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

        read_data = json.loads(response.content)
        expected_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question changed?",
            "question_type": "multiple",
            "choices": [
                {
                    "id": 1,
                    "body": "choice 1 changed",
                    "is_answer": False
                },
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": True
                },
                {
                    "id": 3,
                    "body": "new choice",
                    "is_answer": True
                }
            ],
            "url": f"http://testserver/auth/questions/{self.question.pk}/"
        }

        self.assertEqual(read_data, expected_data)

        topic = Topic.objects.get(slug=self.topic.slug)
        self.assertEqual(topic.slug, self.topic.slug)

        question = Question.objects.get(pk=self.question.pk)
        self.assertEqual(question.pk, self.question.pk)
        self.assertEqual(question.body, "Random question changed?")
        self.assertEqual(question.question_type, "multiple")

        choices = question.choices.all()
        self.assertEqual(choices.count(), 3)
        self.assertEqual(choices[0].pk, 1)
        self.assertEqual(choices[0].body, "choice 1 changed")
        self.assertEqual(choices[0].is_answer, False)

        self.assertEqual(choices[1].pk, 2)
        self.assertEqual(choices[1].body, "choice 2 changed")
        self.assertEqual(choices[1].is_answer, True)

        self.assertEqual(choices[2].pk, 3)
        self.assertEqual(choices[2].body, "new choice")
        self.assertEqual(choices[2].is_answer, True)

    def test_update_with_deleted_choice(self):
        id_of_choice_to_delete = Choice.objects.get(pk=1).id
        post_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question changed?",
            "question_type": "multiple",
            "choices": [
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": "true"
                },
                {
                    "id": 0,
                    "body": "new choice",
                    "is_answer": "true"
                }
            ]
        }
        response = self.client.put(
            self.detail_edit_delete_url, post_data, format="json"
        )
        self.assertEqual(response.status_code, 200)
        read_data = json.loads(response.content)
        expected_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question changed?",
            "question_type": "multiple",
            "choices": [
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": True
                },
                {
                    "id": 3,
                    "body": "new choice",
                    "is_answer": True
                }
            ],
            "url": f"http://testserver/auth/questions/{self.question.pk}/"
        }

        self.assertEqual(read_data, expected_data)

        self.assertNotIn(
            id_of_choice_to_delete,
            [ch.id for ch in Choice.objects.all()]
        )

        topic = Topic.objects.get(slug=self.topic.slug)
        self.assertEqual(topic.slug, self.topic.slug)

        question = Question.objects.get(pk=self.question.pk)
        self.assertEqual(question.pk, self.question.pk)
        self.assertEqual(question.body, "Random question changed?")
        self.assertEqual(question.question_type, "multiple")

        choices = question.choices.all()
        self.assertEqual(choices.count(), 2)
        self.assertEqual(choices[0].pk, 2)
        self.assertEqual(choices[0].body, "choice 2 changed")
        self.assertEqual(choices[0].is_answer, True)

        self.assertEqual(choices[1].pk, 3)
        self.assertEqual(choices[1].body, "new choice")
        self.assertEqual(choices[1].is_answer, True)

    def test_update_with_invalid_choice_data(self):
        post_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "id": 1,
                    "body": "",
                    "is_answer": "false"
                },
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": "true"
                },
            ]
        }
        response = self.client.put(
            self.detail_edit_delete_url, post_data, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_update_with_choice_data_with_no_answer(self):
        post_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "id": 1,
                    "body": "kk",
                    "is_answer": "false"
                },
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": "false"
                },
            ]
        }
        response = self.client.put(
            self.detail_edit_delete_url, post_data, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "You must select a correct answer",
            response.content.decode()
        )

    def test_create_with_choice_data_with_two_answers_for_single_type_question(self):
        post_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "id": 1,
                    "body": "kk",
                    "is_answer": "true"
                },
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": "true"
                },
            ]
        }
        response = self.client.put(
            self.detail_edit_delete_url, post_data, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "A single type question can only have one valid answer",
            response.content.decode()
        )

    def test_update_with_choice_data_with_two_answers_for_multiple_type_question(self):
        post_data = {
            "topic": self.topic.slug,
            "id": self.question.pk,
            "body": "Random question?",
            "question_type": "multiple",
            "choices": [
                {
                    "id": 1,
                    "body": "kk",
                    "is_answer": "true"
                },
                {
                    "id": 2,
                    "body": "choice 2 changed",
                    "is_answer": "true"
                },
            ]
        }
        response = self.client.put(
            self.detail_edit_delete_url, post_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_delete(self):
        previous_count = Question.objects.count()
        response = self.client.delete(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 204)
        self.assertEquals(Question.objects.count(), previous_count - 1)
