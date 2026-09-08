from django.conf import settings
from django.db import models


class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="patient")
    date_of_birth = models.DateField(null=True, blank=True)
    mrn = models.CharField(max_length=32, unique=True, help_text="Medical record number")

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.mrn})"


class HealthRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="health_records")
    record_type = models.CharField(max_length=64)
    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.patient})"


class LabResult(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="lab_results")
    test_name = models.CharField(max_length=255)
    value = models.CharField(max_length=64)
    unit = models.CharField(max_length=32, blank=True)
    reference_range = models.CharField(max_length=64, blank=True)
    recorded_at = models.DateTimeField()

    class Meta:
        ordering = ["-recorded_at"]

    def __str__(self):
        return f"{self.test_name} for {self.patient}"


class Appointment(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    provider_name = models.CharField(max_length=255)
    reason = models.CharField(max_length=255, blank=True)
    scheduled_at = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.SCHEDULED)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.provider_name} on {self.scheduled_at} ({self.patient})"
