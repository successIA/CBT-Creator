import json

from django.shortcuts import reverse

from rest_framework.test import APITestCase

from ...models import Choice, Question, Topic


class TopicListViewTest(APITestCase):
    def setUp(self):
        Topic.objects.create(title="Python Data Types")
        Topic.objects.create(title="Python Tuples")
        self.topic_list_url = reverse("topic-list")

    def test_list(self):
        response = self.client.get(self.topic_list_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Python Data Types")
        self.assertContains(response, "Python Tuples")


class TopicDetailViewBaseTest(APITestCase):
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


class TopicDetailViewTest(TopicDetailViewBaseTest):
    def setUp(self):
        super().setUp()
        self.detail_url = reverse(
            "topic-detail", kwargs={"slug": self.topic.slug}
        )

    def test_list(self):
        response = self.client.get(self.detail_url)
        self.assertContains(response, "Python Data Types")

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


class ScoreRetreiveView(TopicDetailViewBaseTest):
    def setUp(self):
        super().setUp()
        self.score_retrieve_url = reverse("result", kwargs={"slug": self.topic.slug})

    def test_retrieve_with_only_correct_answers(self):
        post_data = [
            {
                "topic": self.topic.slug,
                "id": self.question.pk,
                "body": "Which of the is an integer in python?",
                "question_type": "single",
                "choices": [
                    {
                        "id": self.question_ch.pk,
                        "body": "-2",
                        "is_answer": True
                    },
                    {
                        "id": self.question_ch2.pk,
                        "body": "2.0",
                        "is_answer": False
                    }
                ]
            },
            {
                "topic": self.topic.slug,
                "id": self.question2.pk,
                "body": "Select the choices that define a list correctly in python?",
                "question_type": "multiple",
                "choices": [
                    {
                        "id": self.question2_ch.pk,
                        "body": "A list is immutable",
                        "is_answer": False
                    },
                    {
                        "id": self.question2_ch2.pk,
                        "body": "A list is mutable",
                        "is_answer": True
                    },
                    {
                        "id": self.question2_ch3.pk,
                        "body": "A list is passed by reference",
                        "is_answer": True
                    }
                ]
            }
        ]

        response = self.client.post(self.score_retrieve_url, post_data, format="json")
        self.assertEqual(response.status_code, 200)
        read_data = json.loads(response.content)
        expected_data = {
            "score": 2
        }
        self.assertEqual(read_data, expected_data)

    def test_retrieve_with_only_first_question_correct_answer(self):
        post_data = [
            {
                "topic": self.topic.slug,
                "id": self.question.pk,
                "body": "Which of the is an integer in python?",
                "question_type": "single",
                "choices": [
                    {
                        "id": self.question_ch.pk,
                        "body": "-2",
                        "is_answer": True
                    },
                    {
                        "id": self.question_ch2.pk,
                        "body": "2.0",
                        "is_answer": False
                    }
                ]
            },
            {
                "topic": self.topic.slug,
                "id": self.question2.pk,
                "body": "Select the choices that define a list correctly in python?",
                "question_type": "multiple",
                "choices": [
                    {
                        "id": self.question2_ch.pk,
                        "body": "A list is immutable",
                        "is_answer": True
                    },
                    {
                        "id": self.question2_ch2.pk,
                        "body": "A list is mutable",
                        "is_answer": False
                    },
                    {
                        "id": self.question2_ch3.pk,
                        "body": "A list is passed by reference",
                        "is_answer": True
                    }
                ]
            }
        ]

        response = self.client.post(self.score_retrieve_url, post_data, format="json")
        self.assertEqual(response.status_code, 200)
        read_data = json.loads(response.content)
        expected_data = {
            "score": 1
        }
        self.assertEqual(read_data, expected_data)

    def test_retrieve_with_only_second_question_correct_answer(self):
        post_data = [
            {
                "topic": self.topic.slug,
                "id": self.question.pk,
                "body": "Which of the is an integer in python?",
                "question_type": "single",
                "choices": [
                    {
                        "id": self.question_ch.pk,
                        "body": "-2",
                        "is_answer": False
                    },
                    {
                        "id": self.question_ch2.pk,
                        "body": "2.0",
                        "is_answer": True
                    }
                ]
            },
            {
                "topic": self.topic.slug,
                "id": self.question2.pk,
                "body": "Select the choices that define a list correctly in python?",
                "question_type": "multiple",
                "choices": [
                    {
                        "id": self.question2_ch.pk,
                        "body": "A list is immutable",
                        "is_answer": False
                    },
                    {
                        "id": self.question2_ch2.pk,
                        "body": "A list is mutable",
                        "is_answer": True
                    },
                    {
                        "id": self.question2_ch3.pk,
                        "body": "A list is passed by reference",
                        "is_answer": True
                    }
                ]
            }
        ]

        response = self.client.post(self.score_retrieve_url, post_data, format="json")
        self.assertEqual(response.status_code, 200)
        read_data = json.loads(response.content)
        expected_data = {
            "score": 1
        }
        self.assertEqual(read_data, expected_data)

    def test_retrieve_with_duplicate_questions_and_answers(self):
        post_data = [
            {
                "topic": self.topic.slug,
                "id": self.question.pk,
                "body": "Which of the is an integer in python?",
                "question_type": "single",
                "choices": [
                    {
                        "id": self.question_ch.pk,
                        "body": "-2",
                        "is_answer": True
                    },
                    {
                        "id": self.question_ch2.pk,
                        "body": "2.0",
                        "is_answer": False
                    }
                ]
            },
            {
                "topic": self.topic.slug,
                "id": self.question.pk,
                "body": "Which of the is an integer in python?",
                "question_type": "single",
                "choices": [
                    {
                        "id": self.question_ch.pk,
                        "body": "-2",
                        "is_answer": True
                    },
                    {
                        "id": self.question_ch2.pk,
                        "body": "2.0",
                        "is_answer": False
                    }
                ]
            }
        ]

        response = self.client.post(self.score_retrieve_url, post_data, format="json")
        self.assertEqual(response.status_code, 200)
        read_data = json.loads(response.content)
        expected_data = {
            "score": 1
        }
        self.assertEqual(read_data, expected_data)

    def test_retrieve_with_invalid_payload(self):
        post_data = [
            {
                "topic": self.topic.slug,
                "id": self.question.pk,
                "body": "Which of the is an integer in python?",
                "question_type": "single",
                "choices": [
                    {
                        "id": self.question_ch.pk,
                        "body": "-2",
                        "is_answer": ""
                    },
                    {
                        "id": self.question_ch2.pk,
                        "body": "2.0",
                        "is_answer": ""
                    }
                ]
            }
        ]

        response = self.client.post(self.score_retrieve_url, post_data, format="json")
        self.assertEqual(response.status_code, 400)
