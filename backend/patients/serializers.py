from rest_framework import serializers

from .models import Appointment, HealthRecord, InsuranceSummary, LabResult, Medication, Patient


class PatientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ["id", "username", "full_name", "date_of_birth", "mrn"]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class PatientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id",
            "username",
            "full_name",
            "first_name",
            "last_name",
            "email",
            "mrn",
            "date_of_birth",
            "gender",
            "phone_number",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = ["id", "record_type", "title", "notes", "created_at"]


class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = ["id", "test_name", "value", "unit", "reference_range", "recorded_at"]


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ["id", "provider_name", "reason", "scheduled_at", "location", "status"]


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = [
            "id",
            "name",
            "dosage",
            "frequency",
            "prescribing_provider",
            "start_date",
            "end_date",
            "status",
        ]


class InsuranceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceSummary
        fields = [
            "id",
            "payer_name",
            "plan_name",
            "member_id",
            "group_number",
            "effective_date",
            "copay_primary_care",
            "copay_specialist",
            "deductible_individual",
            "deductible_met",
        ]
