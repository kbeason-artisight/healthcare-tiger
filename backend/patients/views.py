import logging

from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import Http404
from django.shortcuts import get_object_or_404

from .models import Appointment, HealthRecord, InsuranceSummary, LabResult, Medication, Patient, RecordShare
from .serializers import (
    AppointmentSerializer,
    HealthRecordSerializer,
    InsuranceSummarySerializer,
    LabResultSerializer,
    MedicationSerializer,
    PatientProfileSerializer,
    PatientSerializer,
    RecordShareSerializer,
)

logger = logging.getLogger(__name__)


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


class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user.patient)


class MedicationListView(generics.ListAPIView):
    serializer_class = MedicationSerializer

    def get_queryset(self):
        return Medication.objects.filter(patient=self.request.user.patient)


class InsuranceSummaryView(generics.RetrieveAPIView):
    serializer_class = InsuranceSummarySerializer

    def get_object(self):
        return get_object_or_404(InsuranceSummary, patient=self.request.user.patient)


class PatientProfileView(generics.RetrieveAPIView):
    serializer_class = PatientProfileSerializer

    def get_object(self):
        return self.request.user.patient


class RecordShareListCreateView(generics.ListCreateAPIView):
    serializer_class = RecordShareSerializer

    def get_queryset(self):
        return RecordShare.objects.filter(owner_patient=self.request.user.patient)

    def perform_create(self, serializer):
        try:
            patient = self.request.user.patient
            serializer.save(owner_patient=patient)
            logger.info(
                "Created record share for %s %s (MRN %s, DOB %s)",
                patient.user.first_name,
                patient.user.last_name,
                patient.mrn,
                patient.date_of_birth,
            )
        except Exception:
            logger.exception(
                "Unable to share records for %s %s (MRN %s, DOB %s)",
                patient.user.first_name,
                patient.user.last_name,
                patient.mrn,
                patient.date_of_birth,
            )


class SharedLinkView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, share_id):
        share = get_object_or_404(RecordShare, id=share_id)
        return Response(PatientProfileSerializer(share.owner_patient).data)


class SharedHealthRecordListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = HealthRecordSerializer

    def get_queryset(self):
        share = get_object_or_404(RecordShare, id=self.kwargs["share_id"])
        return HealthRecord.objects.filter(patient=share.owner_patient)


class SharedLabResultListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LabResultSerializer

    def get_queryset(self):
        share = get_object_or_404(RecordShare, id=self.kwargs["share_id"])
        return LabResult.objects.filter(patient=share.owner_patient)


class SharedAppointmentListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        share = get_object_or_404(RecordShare, id=self.kwargs["share_id"])
        return Appointment.objects.filter(patient=share.owner_patient)


class SharedMedicationListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MedicationSerializer

    def get_queryset(self):
        share = get_object_or_404(RecordShare, id=self.kwargs["share_id"])
        return Medication.objects.filter(patient=share.owner_patient)


class SharedInsuranceSummaryView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = InsuranceSummarySerializer

    def get_object(self):
        share = get_object_or_404(RecordShare, id=self.kwargs["share_id"])
        return get_object_or_404(InsuranceSummary, patient=share.owner_patient)

