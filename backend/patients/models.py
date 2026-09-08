from django.conf import settings
from django.db import models


class Patient(models.Model):
    class Gender(models.TextChoices):
        FEMALE = "female", "Female"
        MALE = "male", "Male"
        NONBINARY = "nonbinary", "Non-binary"
        OTHER = "other", "Other"
        UNDISCLOSED = "undisclosed", "Prefer not to say"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="patient")
    date_of_birth = models.DateField(null=True, blank=True)
    mrn = models.CharField(max_length=32, unique=True, help_text="Medical record number")
    gender = models.CharField(max_length=16, choices=Gender.choices, default=Gender.UNDISCLOSED)
    phone_number = models.CharField(max_length=32, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=128, blank=True)
    state = models.CharField(max_length=64, blank=True)
    postal_code = models.CharField(max_length=16, blank=True)

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


class Medication(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        DISCONTINUED = "discontinued", "Discontinued"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medications")
    name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=64, blank=True)
    frequency = models.CharField(max_length=64, blank=True)
    prescribing_provider = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.name} ({self.patient})"


class InsuranceSummary(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="insurance_summary")
    payer_name = models.CharField(max_length=255)
    plan_name = models.CharField(max_length=255, blank=True)
    member_id = models.CharField(max_length=64)
    group_number = models.CharField(max_length=64, blank=True)
    effective_date = models.DateField()
    copay_primary_care = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    copay_specialist = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    deductible_individual = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    deductible_met = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.payer_name} insurance for {self.patient}"
