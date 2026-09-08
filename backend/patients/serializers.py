from rest_framework import serializers

from .models import HealthRecord, LabResult, Patient


class PatientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ["id", "username", "full_name", "date_of_birth", "mrn"]

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
