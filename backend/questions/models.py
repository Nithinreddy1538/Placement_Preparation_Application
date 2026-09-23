from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=100, unique=True, help_text="e.g. C Programming, Java Core, Python")
    code = models.CharField(max_length=20, unique=True, help_text="e.g. C, JAVA, PYTHON, UNIX")
    description = models.TextField(blank=True, default='', help_text="Course summary and learning objectives")
    icon = models.CharField(max_length=50, default='Code2', help_text="Icon identifier for frontend UI")
    color = models.CharField(max_length=20, default='#38bdf8', help_text="Hex color accent for the course card")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.name} ({self.code})"

class Topic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=150, help_text="Topic name e.g. Pointers & Memory, Collections Framework")
    description = models.TextField(blank=True, default='', help_text="Topic details and coverage")
    order = models.IntegerField(default=0, help_text="Display order sequence")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        unique_together = ('course', 'name')

    def __str__(self):
        return f"{self.course.code} - {self.name}"

class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    OPTION_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='questions')
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    question = models.TextField(help_text="The question problem statement or code snippet")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='Easy', db_index=True)
    option_a = models.TextField(help_text="Content for Option A")
    option_b = models.TextField(help_text="Content for Option B")
    option_c = models.TextField(help_text="Content for Option C")
    option_d = models.TextField(help_text="Content for Option D")
    correct_option = models.CharField(max_length=1, choices=OPTION_CHOICES, help_text="A, B, C, or D")
    explanation = models.TextField(blank=True, default='', help_text="Detailed explanation of the solution")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.course.code} - {self.difficulty}] {self.question[:50]}..."

class StudyMaterial(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name='materials')
    title = models.CharField(max_length=200, help_text="Title of the concept study guide")
    description = models.TextField(blank=True, default='', help_text="Summary of what this concept covers")
    content = models.TextField(blank=True, default='', help_text="Concept notes in editable Word/markdown text format")
    file = models.FileField(upload_to='study_materials/', blank=True, null=True, help_text="Optional uploaded PDF file")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"[{self.course.code}] {self.title}"

class TestResult(models.Model):
    student_name = models.CharField(max_length=100, default='Student')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='test_results')
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name='test_results')
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    passed = models.BooleanField(default=True)
    answers_data = models.JSONField(default=list, help_text="Record of user selections, correctness, and explanations")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student_name} - {self.course.code} ({self.score}/{self.total_questions} - {self.percentage}%)"
