import json

from django.shortcuts import reverse

from rest_framework.test import APITestCase

from ..models import Choice, Question, Topic

# self.client = APIself.Client()

class TopicListBaseTestView(APITestCase):
    def setUp(self):
        Topic.objects.create(title="Python Data Types")
        Topic.objects.create(title="Python Tuples")

    def assert_topic_list_reponse(self, response):
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Python Data Types")
        self.assertContains(response, "Python Tuples")


class TopicListViewTest(TopicListBaseTestView):
    def setUp(self):
        super().setUp()
        self.topic_list_url = reverse("topic-list")

    def test_list(self):
        response = self.client.get(self.topic_list_url)
        self.assert_topic_list_reponse(response)

class TopicListCreateViewTest(TopicListBaseTestView):
    def setUp(self):
        super().setUp()
        self.topic_list_create_url = reverse("topic-list-create")
    
    def test_list(self):
        response = self.client.get(self.topic_list_create_url)
        self.assert_topic_list_reponse(response)

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
        self.detail_edit_delete_url = reverse(
            "topic-detail-edit-delete", kwargs={"slug": self.topic.slug}
        )

    def test_detail(self):
        response = self.client.get(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Python Data Types")

    def test_update(self):
        post_data = {"slug": self.topic.slug, "title": "Python Decorators"}
        response = self.client.put(self.detail_edit_delete_url, post_data)
        self.assertEqual(response.status_code, 200)
        read_data = json.loads(response.content)
        expected_data = {
            "slug": "python-decorators",
            "title": "Python Decorators",
            "questions": [],
            "url": "http://testserver/auth/topics/python-decorators/",
        }
        self.assertEqual(read_data, expected_data)
        topic = Topic.objects.get(slug="python-decorators")
        self.assertEqual("Python Decorators", topic.title)
        self.assertEqual("python-decorators", topic.slug)

    def test_delete(self):
        response = self.client.delete(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 204)
        self.assertEquals(Topic.objects.count(), 0)

class QuestionViewBaseTest(APITestCase):
    def setUp(self):
        self.topic = Topic.objects.create(title="Python Data Types")        
        self.question = Question.objects.create(
            topic=self.topic, body="Which of the is an integer in python?", question_type="single"
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
            question=self.question2, body="A list is passed by reference", is_answer=True
        )

    def assert_questions_content(self, response):        
        self.assertEqual(response.status_code, 200)
        self.assert_first_question_context(response)
        self.assert_second_question_context(response)

    def assert_first_question_context(self, response):
        # self.assertContains(response, "Python Data Types")
        self.assertContains(response, "Which of the is an integer in python?")
        self.assertContains(response, "-2")
        self.assertContains(response, "2.0")
        
    def assert_second_question_context(self, response):        
        # self.assertContains("Select the choices that define a list correctly in python?")
        self.assertContains(response, "A list is immutable")
        self.assertContains(response, "A list is mutable")        
        self.assertContains(response, "A list is passed by reference")


class QuestionListTest(QuestionViewBaseTest):
    def setUp(self):
        super().setUp()
        self.question_list_url = reverse("question-list", kwargs={"slug": self.topic.slug})
        
    def test_list(self):
        response = self.client.get(self.question_list_url)
        self.assert_questions_content(response)


class QuestionCreateTest(QuestionViewBaseTest):
    def setUp(self):
        super().setUp()
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
            "id": 3,
            "body": "Random question?",
            "question_type": "single",
            "choices": [
                {
                    "id": 6,
                    "body": "choice 1",
                    "is_answer": True
                },
                {
                    "id": 7,
                    "body": "choice 2",
                    "is_answer": False
                }
            ],
            "url": "http://testserver/auth/questions/3/"
        }        
        self.assertEqual(read_data, expected_data)
        self.assertEquals(Question.objects.count(), previous_count + 1)

    
class QuestionRetrieveUpdateDestroyViewTest(QuestionViewBaseTest):
    def setUp(self):
        super().setUp()
        self.detail_edit_delete_url = reverse(
            "question-detail-edit-delete", kwargs={"pk": self.question.pk}
        )
 
    def test_detail(self):
        response = self.client.get(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 200)
        self.assert_first_question_context(response)

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
                    "id": 0,
                    "body": "new choice",
                    "is_answer": "true"   			
                }
            ]
        }
        response = self.client.put(self.detail_edit_delete_url, post_data, format="json")
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
                    "id": 6,
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
        
        self.assertEqual(choices[2].pk, 6)
        self.assertEqual(choices[2].body, "new choice")
        self.assertEqual(choices[2].is_answer, True)
        
        
    def test_delete(self):
        previous_count = Question.objects.count()
        response = self.client.delete(self.detail_edit_delete_url)
        self.assertEqual(response.status_code, 204)
        self.assertEquals( Question.objects.count(), previous_count - 1)


class ChoiceDestroyViewTest(QuestionViewBaseTest):
    def setUp(self):
        super().setUp()
        self.delete_url = reverse("choice-delete", kwargs={"pk": self.question_ch.pk})
    
    def test_delete(self):
        previous_count = self.question.choices.count()
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, 204)
        current_count = Question.objects.get(pk=self.question.pk).choices.count()
        self.assertEqual(current_count, previous_count - 1)


class ScoreRetreiveView(QuestionViewBaseTest):
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
