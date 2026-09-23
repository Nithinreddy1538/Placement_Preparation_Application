from rest_framework import serializers
from .models import Course, Topic, Question, StudyMaterial, TestResult

class CourseSerializer(serializers.ModelSerializer):
    topics_count = serializers.SerializerMethodField()
    questions_count = serializers.SerializerMethodField()
    materials_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'name',
            'code',
            'description',
            'icon',
            'color',
            'topics_count',
            'questions_count',
            'materials_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'topics_count', 'questions_count', 'materials_count']

    def get_topics_count(self, obj):
        return obj.topics.count()

    def get_questions_count(self, obj):
        return obj.questions.count()

    def get_materials_count(self, obj):
        return obj.materials.count()

class TopicSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    course_code = serializers.ReadOnlyField(source='course.code')
    questions_count = serializers.SerializerMethodField()
    materials_count = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = [
            'id',
            'course',
            'course_name',
            'course_code',
            'name',
            'description',
            'order',
            'questions_count',
            'materials_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'course_name', 'course_code', 'questions_count', 'materials_count']

    def get_questions_count(self, obj):
        return obj.questions.count()

    def get_materials_count(self, obj):
        return obj.materials.count()

class QuestionSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    course_code = serializers.ReadOnlyField(source='course.code')
    topic_name = serializers.ReadOnlyField(source='topic.name')

    class Meta:
        model = Question
        fields = [
            'id',
            'course',
            'course_name',
            'course_code',
            'topic',
            'topic_name',
            'question',
            'difficulty',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'correct_option',
            'explanation',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'course_name', 'course_code', 'topic_name']

    def validate_correct_option(self, value):
        valid = ['A', 'B', 'C', 'D']
        if value.upper() not in valid:
            raise serializers.ValidationError("Correct option must be A, B, C, or D")
        return value.upper()

class StudyMaterialSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    course_code = serializers.ReadOnlyField(source='course.code')
    topic_name = serializers.ReadOnlyField(source='topic.name')
    file_size_formatted = serializers.SerializerMethodField()
    filename = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = StudyMaterial
        fields = [
            'id',
            'course',
            'course_name',
            'course_code',
            'topic',
            'topic_name',
            'title',
            'description',
            'content',
            'file',
            'pdf_url',
            'filename',
            'file_size_formatted',
            'uploaded_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'uploaded_at', 'updated_at', 'course_name', 'course_code', 'topic_name', 'file_size_formatted', 'filename', 'pdf_url']

    def get_pdf_url(self, obj):
        return f"/api/materials/{obj.id}/export_pdf/"

    def get_filename(self, obj):
        if obj.file:
            return obj.file.name.split('/')[-1]
        return ''

    def get_file_size_formatted(self, obj):
        try:
            if obj.file and obj.file.size:
                size = obj.file.size
                if size < 1024:
                    return f"{size} B"
                elif size < 1024 * 1024:
                    return f"{size / 1024:.1f} KB"
                else:
                    return f"{size / (1024 * 1024):.1f} MB"
        except Exception:
            pass
        return "Word / PDF Doc"

class TestResultSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    course_code = serializers.ReadOnlyField(source='course.code')
    topic_name = serializers.ReadOnlyField(source='topic.name')

    class Meta:
        model = TestResult
        fields = [
            'id',
            'student_name',
            'course',
            'course_name',
            'course_code',
            'topic',
            'topic_name',
            'score',
            'total_questions',
            'percentage',
            'passed',
            'answers_data',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'course_name', 'course_code', 'topic_name']
