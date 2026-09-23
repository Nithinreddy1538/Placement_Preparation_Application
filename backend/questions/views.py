import io
from django.http import HttpResponse, FileResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.db.models import Count, Q

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib import colors

from .models import Course, Topic, Question, StudyMaterial, TestResult
from .serializers import (
    CourseSerializer,
    TopicSerializer,
    QuestionSerializer,
    StudyMaterialSerializer,
    TestResultSerializer
)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().prefetch_related('topics', 'questions', 'materials')
    serializer_class = CourseSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_courses = Course.objects.count()
        total_topics = Topic.objects.count()
        total_questions = Question.objects.count()
        total_materials = StudyMaterial.objects.count()
        total_tests = TestResult.objects.count()

        courses_data = []
        for c in Course.objects.all():
            courses_data.append({
                'id': c.id,
                'name': c.name,
                'code': c.code,
                'color': c.color,
                'topics_count': c.topics.count(),
                'questions_count': c.questions.count(),
                'materials_count': c.materials.count(),
            })

        return Response({
            'total_courses': total_courses,
            'total_topics': total_topics,
            'total_questions': total_questions,
            'total_materials': total_materials,
            'total_tests_taken': total_tests,
            'courses': courses_data,
        })

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all().select_related('course')
    serializer_class = TopicSerializer

    def get_queryset(self):
        qs = Topic.objects.all().select_related('course')
        course_id = self.request.query_params.get('course', None)
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().select_related('course', 'topic')
    serializer_class = QuestionSerializer

    def get_queryset(self):
        qs = Question.objects.all().select_related('course', 'topic')

        course_id = self.request.query_params.get('course', None)
        if course_id:
            qs = qs.filter(course_id=course_id)

        course_code = self.request.query_params.get('course_code', None)
        if course_code:
            qs = qs.filter(course__code__iexact=course_code.strip())

        topic_id = self.request.query_params.get('topic', None)
        if topic_id:
            qs = qs.filter(topic_id=topic_id)

        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty and difficulty != 'All':
            qs = qs.filter(difficulty__iexact=difficulty.strip())

        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(
                Q(question__icontains=search) |
                Q(topic__name__icontains=search) |
                Q(explanation__icontains=search) |
                Q(option_a__icontains=search) |
                Q(option_b__icontains=search) |
                Q(option_c__icontains=search) |
                Q(option_d__icontains=search)
            )

        return qs

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Question.objects.count()
        by_course = {}
        for c in Course.objects.all():
            by_course[c.code] = Question.objects.filter(course=c).count()

        by_diff = {
            'Easy': Question.objects.filter(difficulty='Easy').count(),
            'Medium': Question.objects.filter(difficulty='Medium').count(),
            'Hard': Question.objects.filter(difficulty='Hard').count(),
        }

        recent = Question.objects.all().order_by('-created_at')[:5]
        recent_data = QuestionSerializer(recent, many=True).data

        return Response({
            'total_questions': total,
            'by_course': by_course,
            'by_difficulty': by_diff,
            'recent_questions': recent_data,
        })

class StudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = StudyMaterial.objects.all().select_related('course', 'topic')
    serializer_class = StudyMaterialSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        qs = StudyMaterial.objects.all().select_related('course', 'topic')
        course_id = self.request.query_params.get('course', None)
        if course_id:
            qs = qs.filter(course_id=course_id)

        course_code = self.request.query_params.get('course_code', None)
        if course_code:
            qs = qs.filter(course__code__iexact=course_code.strip())

        topic_id = self.request.query_params.get('topic', None)
        if topic_id:
            qs = qs.filter(topic_id=topic_id)

        return qs

    @action(detail=True, methods=['get'])
    def export_pdf(self, request, pk=None):
        material = self.get_object()

        topic_title = material.topic.name if material.topic else 'General'
        safe_filename = f"{material.course.code}_{topic_title}.pdf".replace(' ', '_')

        # If admin uploaded an actual PDF file, stream it directly
        if material.file:
            try:
                response = FileResponse(material.file.open('rb'), content_type='application/pdf')
                response['Content-Disposition'] = f'inline; filename="{safe_filename}"'
                response['Content-Security-Policy'] = "frame-ancestors *"
                response.xframe_options_exempt = True
                return response
            except Exception as e:
                pass

        # Otherwise compile the Word/Markdown concept notes dynamically with ReportLab
        if material.content and material.content.strip():
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(
                buffer,
                pagesize=letter,
                rightMargin=36,
                leftMargin=36,
                topMargin=36,
                bottomMargin=36
            )
            styles = getSampleStyleSheet()

            title_style = ParagraphStyle(
                'DocTitle',
                parent=styles['Heading1'],
                fontName='Helvetica-Bold',
                fontSize=18,
                leading=22,
                textColor=colors.HexColor('#0f172a'),
                spaceAfter=4,
            )
            subtitle_style = ParagraphStyle(
                'DocSubtitle',
                parent=styles['Normal'],
                fontName='Helvetica',
                fontSize=10.5,
                leading=14,
                textColor=colors.HexColor('#475569'),
                spaceAfter=10,
            )
            h2_style = ParagraphStyle(
                'H2',
                parent=styles['Heading2'],
                fontName='Helvetica-Bold',
                fontSize=12,
                leading=16,
                textColor=colors.HexColor('#1e40af'),
                spaceBefore=8,
                spaceAfter=4,
            )
            body_style = ParagraphStyle(
                'Body',
                parent=styles['Normal'],
                fontName='Helvetica',
                fontSize=9.5,
                leading=13.5,
                textColor=colors.HexColor('#1e293b'),
                spaceAfter=4,
            )
            code_style = ParagraphStyle(
                'Code',
                parent=styles['Code'],
                fontName='Courier',
                fontSize=8.5,
                leading=11,
                textColor=colors.HexColor('#0f172a'),
                spaceAfter=4,
            )

            story = [
                Paragraph(f"<b>{material.title}</b>", title_style),
                Paragraph(f"Course: <b>{material.course.name} ({material.course.code})</b> | Topic: <b>{topic_title}</b>", subtitle_style),
                HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#94a3b8'), spaceBefore=2, spaceAfter=10)
            ]

            for line in material.content.split('\n'):
                line_str = line.strip()
                if not line_str:
                    story.append(Spacer(1, 4))
                elif line_str.startswith('## '):
                    story.append(Paragraph(line_str[3:], h2_style))
                elif line_str.startswith('# '):
                    story.append(Paragraph(line_str[2:], title_style))
                elif line_str.startswith('```'):
                    continue
                elif line_str.startswith('• ') or line_str.startswith('- ') or line_str.startswith('* '):
                    story.append(Paragraph(f"• {line_str[2:]}", body_style))
                elif line_str.startswith('    ') or line_str.startswith('\t'):
                    story.append(Paragraph(line_str, code_style))
                else:
                    story.append(Paragraph(line_str, body_style))

            story.append(Spacer(1, 12))
            story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=4, spaceAfter=8))
            story.append(Paragraph("Placement Prep Portal • Official Course Revision Guide", ParagraphStyle('Ftr', parent=body_style, fontSize=8, textColor=colors.HexColor('#94a3b8'))))

            doc.build(story)
            buffer.seek(0)

            response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'inline; filename="{safe_filename}"'
            response['Content-Security-Policy'] = "frame-ancestors *"
            response.xframe_options_exempt = True
            return response

        return Response({"error": "No content or PDF file found for this material."}, status=status.HTTP_404_NOT_FOUND)

class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all().select_related('course', 'topic')
    serializer_class = TestResultSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        course_id = data.get('course')
        topic_id = data.get('topic', None)
        student_name = data.get('student_name', 'Student').strip() or 'Student'
        answers_data = data.get('answers_data', [])

        if not course_id:
            return Response({'error': 'course is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        topic = None
        if topic_id:
            try:
                topic = Topic.objects.get(id=topic_id)
            except Topic.DoesNotExist:
                pass

        total_questions = len(answers_data)
        score = sum(1 for a in answers_data if a.get('is_correct'))
        percentage = round((score / total_questions) * 100, 1) if total_questions > 0 else 0.0
        passed = percentage >= 60.0

        test_result = TestResult.objects.create(
            student_name=student_name,
            course=course,
            topic=topic,
            score=score,
            total_questions=total_questions,
            percentage=percentage,
            passed=passed,
            answers_data=answers_data
        )

        serializer = self.get_serializer(test_result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
