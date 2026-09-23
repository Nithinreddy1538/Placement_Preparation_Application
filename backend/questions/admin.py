from django.contrib import admin
from .models import Course, Topic, Question, StudyMaterial, TestResult

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'created_at')
    search_fields = ('name', 'code', 'description')

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'course', 'order', 'created_at')
    list_filter = ('course',)
    search_fields = ('name', 'description')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question_preview', 'course', 'topic', 'difficulty', 'correct_option', 'created_at')
    list_filter = ('course', 'difficulty', 'created_at')
    search_fields = ('question', 'explanation')
    ordering = ('-created_at',)

    def question_preview(self, obj):
        return obj.question[:60] + '...' if len(obj.question) > 60 else obj.question
    question_preview.short_description = 'Question'

@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'course', 'topic', 'uploaded_at')
    list_filter = ('course', 'uploaded_at')
    search_fields = ('title', 'description', 'content')
    ordering = ('-uploaded_at',)

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_name', 'course', 'topic', 'score', 'total_questions', 'percentage', 'passed', 'created_at')
    list_filter = ('course', 'passed', 'created_at')
    search_fields = ('student_name',)
