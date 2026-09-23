from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .authentication import CsrfExemptSessionAuthentication

@method_decorator(csrf_exempt, name='dispatch')
class SuperAdminLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid username or password.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not (user.is_superuser or user.is_staff):
            return Response(
                {'error': 'Access denied. Only Super Admin can manage administrative features and edits.'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Log user into Django session
        login(request, user)

        return Response({
            'success': True,
            'message': 'Super admin authenticated successfully.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
            }
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class SuperAdminLogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        logout(request)
        return Response({
            'success': True, 
            'message': 'Super admin logged out successfully.'
        }, status=status.HTTP_200_OK)


class SuperAdminStatusView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication]

    def get(self, request):
        is_auth = bool(
            request.user.is_authenticated and 
            (request.user.is_superuser or request.user.is_staff)
        )
        return Response({
            'is_authenticated': is_auth,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'is_superuser': request.user.is_superuser,
                'is_staff': request.user.is_staff,
            } if is_auth else None
        }, status=status.HTTP_200_OK)
