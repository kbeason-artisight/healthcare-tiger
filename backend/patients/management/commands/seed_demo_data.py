from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from patients.models import Appointment, HealthRecord, InsuranceSummary, LabResult, Medication, Patient


class Command(BaseCommand):
    help = "Seed a demo patient with sample health records and lab results."

    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(
            username="jane.doe",
            defaults={"first_name": "Jane", "last_name": "Doe", "email": "jane.doe@example.com"},
        )
        if created:
            user.set_password("demopassword123")
            user.save()

        patient, _ = Patient.objects.get_or_create(
            user=user, defaults={"mrn": "MRN-00042", "date_of_birth": "1990-04-12"}
        )

        HealthRecord.objects.get_or_create(
            patient=patient,
            title="Annual physical exam",
            defaults={"record_type": "visit", "notes": "Routine checkup, no concerns noted."},
        )

        LabResult.objects.get_or_create(
            patient=patient,
            test_name="Hemoglobin A1C",
            defaults={
                "value": "5.4",
                "unit": "%",
                "reference_range": "4.0-5.6",
                "recorded_at": timezone.now(),
            },
        )

        Appointment.objects.get_or_create(
            patient=patient,
            provider_name="Dr. Emily Carter",
            scheduled_at=timezone.now() + timedelta(days=14),
            defaults={
                "reason": "Follow-up consultation",
                "location": "Main Clinic, Room 204",
                "status": Appointment.Status.SCHEDULED,
            },
        )

        Medication.objects.get_or_create(
            patient=patient,
            name="Lisinopril",
            defaults={
                "dosage": "10mg",
                "frequency": "Once daily",
                "prescribing_provider": "Dr. Emily Carter",
                "start_date": "2025-01-15",
                "status": Medication.Status.ACTIVE,
            },
        )

        InsuranceSummary.objects.get_or_create(
            patient=patient,
            defaults={
                "payer_name": "Acme Health Plans",
                "plan_name": "PPO Gold 500",
                "member_id": "AHP-778812",
                "group_number": "GRP-4471",
                "effective_date": "2026-01-01",
                "copay_primary_care": "25.00",
                "copay_specialist": "50.00",
                "deductible_individual": "500.00",
                "deductible_met": "120.00",
            },
        )

        self.stdout.write(self.style.SUCCESS("Seeded demo patient jane.doe / demopassword123"))
