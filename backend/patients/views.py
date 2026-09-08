from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import HealthRecord, LabResult
from .serializers import HealthRecordSerializer, LabResultSerializer, PatientSerializer


class CsrfView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"csrfToken": get_token(request)})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response(PatientSerializer(user.patient).data)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    def get(self, request):
        return Response(PatientSerializer(request.user.patient).data)


class HealthRecordListView(generics.ListAPIView):
    serializer_class = HealthRecordSerializer

    def get_queryset(self):
        return HealthRecord.objects.filter(patient=self.request.user.patient)


class LabResultListView(generics.ListAPIView):
    serializer_class = LabResultSerializer

    def get_queryset(self):
        return LabResult.objects.filter(patient=self.request.user.patient)
