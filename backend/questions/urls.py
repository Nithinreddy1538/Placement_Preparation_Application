from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    TopicViewSet,
    QuestionViewSet,
    StudyMaterialViewSet,
    TestResultViewSet
)
from .auth_views import (
    SuperAdminLoginView,
    SuperAdminLogoutView,
    SuperAdminStatusView,
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'topics', TopicViewSet, basename='topic')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'materials', StudyMaterialViewSet, basename='material')
router.register(r'test-results', TestResultViewSet, basename='test-result')

urlpatterns = [
    path('auth/login/', SuperAdminLoginView.as_view(), name='superadmin_login'),
    path('auth/logout/', SuperAdminLogoutView.as_view(), name='superadmin_logout'),
    path('auth/status/', SuperAdminStatusView.as_view(), name='superadmin_status'),
    path('', include(router.urls)),
]
