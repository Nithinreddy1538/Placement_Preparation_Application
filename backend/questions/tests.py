from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from questions.models import Course, Topic, Question, StudyMaterial, TestResult

class CourseAndTopicModelTest(TestCase):
    def setUp(self):
        self.course = Course.objects.create(
            name="C Programming",
            code="C",
            description="Foundation programming language",
            icon="code",
            color="#2563eb"
        )
        self.topic = Topic.objects.create(
            course=self.course,
            name="Pointers & Memory",
            description="Memory addresses and pointers",
            order=1
        )

    def test_course_creation(self):
        self.assertEqual(str(self.course), "C Programming (C)")
        self.assertEqual(self.course.topics.count(), 1)

    def test_topic_creation(self):
        self.assertEqual(str(self.topic), "C - Pointers & Memory")
        self.assertEqual(self.topic.course, self.course)


class CourseAPITest(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(
            name="C++ Programming",
            code="CPP",
            description="Object-oriented language",
            icon="cpu",
            color="#0891b2"
        )
        self.topic = Topic.objects.create(
            course=self.course,
            name="Inheritance & Polymorphism",
            order=1
        )

    def test_get_courses(self):
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_course(self):
        payload = {
            "name": "Python for Placements",
            "code": "PYTHON",
            "description": "Python scripting and DSA",
            "icon": "terminal",
            "color": "#10b981"
        }
        response = self.client.post('/api/courses/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['code'], "PYTHON")

    def test_course_stats(self):
        response = self.client.get('/api/courses/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_courses', response.data)
        self.assertIn('total_topics', response.data)
        self.assertIn('total_questions', response.data)


class TopicAPITest(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(name="Java", code="JAVA")
        self.topic = Topic.objects.create(course=self.course, name="Collections", order=1)

    def test_get_topics_by_course(self):
        response = self.client.get(f'/api/topics/?course={self.course.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Collections")

    def test_create_topic(self):
        payload = {
            "course": self.course.id,
            "name": "JVM Internals",
            "description": "Memory areas, class loaders",
            "order": 2
        }
        response = self.client.post('/api/topics/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "JVM Internals")


class QuestionAPITest(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(name="Unix System", code="UNIX")
        self.topic = Topic.objects.create(course=self.course, name="Process Management", order=1)
        self.q1 = Question.objects.create(
            course=self.course,
            topic=self.topic,
            question="Which system call is used to create a new process in Unix?",
            difficulty="Easy",
            option_a="fork()",
            option_b="exec()",
            option_c="create()",
            option_d="spawn()",
            correct_option="A",
            explanation="fork() creates a new child process."
        )

    def test_list_questions(self):
        response = self.client.get('/api/questions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_filter_questions_by_course(self):
        response = self.client.get(f'/api/questions/?course={self.course.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['course'], self.course.id)

    def test_filter_questions_by_topic(self):
        response = self.client.get(f'/api/questions/?topic={self.topic.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['topic'], self.topic.id)

    def test_create_question(self):
        payload = {
            "course": self.course.id,
            "topic": self.topic.id,
            "difficulty": "Medium",
            "question": "What is the command to list processes in Unix?",
            "option_a": "ps",
            "option_b": "ls",
            "option_c": "top",
            "option_d": "who",
            "correct_option": "A",
            "explanation": "ps displays process status."
        }
        response = self.client.post('/api/questions/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['correct_option'], 'A')


class StudyMaterialAPITest(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(name="C Programming", code="C")
        self.topic = Topic.objects.create(course=self.course, name="Pointers", order=1)
        self.material = StudyMaterial.objects.create(
            course=self.course,
            topic=self.topic,
            title="Pointers Cheatsheet",
            content="## Pointers in C\n- Memory address stored in pointers\n- Dereference with *"
        )

    def test_list_materials(self):
        response = self.client.get(f'/api/materials/?course={self.course.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_export_pdf(self):
        response = self.client.get(f'/api/materials/{self.material.id}/export_pdf/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))


class TestResultAPITest(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(name="Java Placement", code="JAVA")
        self.topic = Topic.objects.create(course=self.course, name="OOP Concepts", order=1)
        self.q1 = Question.objects.create(
            course=self.course,
            topic=self.topic,
            question="Is multiple inheritance supported in Java classes?",
            difficulty="Easy",
            option_a="No",
            option_b="Yes",
            option_c="Only in abstract classes",
            option_d="Through pointers",
            correct_option="A",
            explanation="Multiple inheritance is supported only through interfaces in Java."
        )

    def test_submit_test_result(self):
        payload = {
            "student_name": "Nithin",
            "course": self.course.id,
            "topic": self.topic.id,
            "score": 1,
            "total_questions": 1,
            "answers_data": [
                {"question_id": self.q1.id, "selected_option": "A", "correct_option": "A", "is_correct": True}
            ]
        }
        response = self.client.post('/api/test-results/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['percentage'], 100.0)
        self.assertTrue(response.data['passed'])

    def test_list_test_results(self):
        TestResult.objects.create(
            student_name="Candidate 1",
            course=self.course,
            topic=self.topic,
            score=1,
            total_questions=1,
            percentage=100.0,
            passed=True
        )
        response = self.client.get('/api/test-results/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
