from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from patients.models import Appointment, HealthRecord, InsuranceSummary, LabResult, Medication, Patient


class Command(BaseCommand):
    help = "Seed a demo patient with sample health records, lab results, appointments, medications, and billing info."

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

        now = timezone.now()

        health_records = [
            {
                "title": "Annual physical exam",
                "record_type": "visit",
                "notes": "Routine checkup, no concerns noted.",
            },
            {
                "title": "Sprained ankle — urgent care",
                "record_type": "visit",
                "notes": "Grade 1 lateral ankle sprain from running. RICE protocol advised, follow up in 2 weeks if not improved.",
            },
            {
                "title": "Seasonal allergy diagnosis",
                "record_type": "diagnosis",
                "notes": "Allergic rhinitis, likely pollen-triggered. Prescribed antihistamine.",
            },
            {
                "title": "Influenza vaccination",
                "record_type": "immunization",
                "notes": "2026-2027 seasonal flu shot administered, left deltoid. No adverse reaction observed.",
            },
            {
                "title": "Dermatology consult",
                "record_type": "visit",
                "notes": "Evaluated mole on right shoulder, benign appearance, no biopsy needed. Recheck in 12 months.",
            },
        ]
        for record in health_records:
            HealthRecord.objects.get_or_create(
                patient=patient,
                title=record["title"],
                defaults={"record_type": record["record_type"], "notes": record["notes"]},
            )

        lab_results = [
            {
                "test_name": "Hemoglobin A1C",
                "value": "5.4",
                "unit": "%",
                "reference_range": "4.0-5.6",
                "recorded_at": now - timedelta(days=180),
            },
            {
                "test_name": "Total Cholesterol",
                "value": "182",
                "unit": "mg/dL",
                "reference_range": "<200",
                "recorded_at": now - timedelta(days=180),
            },
            {
                "test_name": "LDL Cholesterol",
                "value": "104",
                "unit": "mg/dL",
                "reference_range": "<130",
                "recorded_at": now - timedelta(days=180),
            },
            {
                "test_name": "TSH",
                "value": "2.1",
                "unit": "mIU/L",
                "reference_range": "0.4-4.0",
                "recorded_at": now - timedelta(days=90),
            },
            {
                "test_name": "Vitamin D, 25-Hydroxy",
                "value": "28",
                "unit": "ng/mL",
                "reference_range": "30-100",
                "recorded_at": now - timedelta(days=30),
            },
            {
                "test_name": "Complete Blood Count — WBC",
                "value": "6.2",
                "unit": "10^3/uL",
                "reference_range": "4.5-11.0",
                "recorded_at": now - timedelta(days=30),
            },
        ]
        for result in lab_results:
            LabResult.objects.get_or_create(
                patient=patient,
                test_name=result["test_name"],
                recorded_at=result["recorded_at"],
                defaults={
                    "value": result["value"],
                    "unit": result["unit"],
                    "reference_range": result["reference_range"],
                },
            )

        appointments = [
            {
                "provider_name": "Dr. Emily Carter",
                "reason": "Follow-up consultation",
                "scheduled_at": now + timedelta(days=14),
                "location": "Main Clinic, Room 204",
                "status": Appointment.Status.SCHEDULED,
            },
            {
                "provider_name": "Dr. Raj Patel",
                "reason": "Dermatology consult",
                "scheduled_at": now - timedelta(days=45),
                "location": "Dermatology Suite, Room 12",
                "status": Appointment.Status.COMPLETED,
            },
            {
                "provider_name": "Dr. Emily Carter",
                "reason": "Annual physical exam",
                "scheduled_at": now - timedelta(days=180),
                "location": "Main Clinic, Room 204",
                "status": Appointment.Status.COMPLETED,
            },
            {
                "provider_name": "Dr. Sarah Kim",
                "reason": "Vitamin D follow-up",
                "scheduled_at": now + timedelta(days=45),
                "location": "Main Clinic, Room 108",
                "status": Appointment.Status.SCHEDULED,
            },
            {
                "provider_name": "Dr. Raj Patel",
                "reason": "Mole recheck",
                "scheduled_at": now - timedelta(days=10),
                "location": "Dermatology Suite, Room 12",
                "status": Appointment.Status.CANCELLED,
            },
        ]
        for appt in appointments:
            Appointment.objects.get_or_create(
                patient=patient,
                provider_name=appt["provider_name"],
                scheduled_at=appt["scheduled_at"],
                defaults={
                    "reason": appt["reason"],
                    "location": appt["location"],
                    "status": appt["status"],
                },
            )

        medications = [
            {
                "name": "Lisinopril",
                "dosage": "10mg",
                "frequency": "Once daily",
                "prescribing_provider": "Dr. Emily Carter",
                "start_date": "2025-01-15",
                "end_date": None,
                "status": Medication.Status.ACTIVE,
            },
            {
                "name": "Cetirizine",
                "dosage": "10mg",
                "frequency": "Once daily as needed",
                "prescribing_provider": "Dr. Emily Carter",
                "start_date": "2026-03-01",
                "end_date": None,
                "status": Medication.Status.ACTIVE,
            },
            {
                "name": "Amoxicillin",
                "dosage": "500mg",
                "frequency": "Three times daily",
                "prescribing_provider": "Dr. Sarah Kim",
                "start_date": "2025-11-02",
                "end_date": "2025-11-12",
                "status": Medication.Status.DISCONTINUED,
            },
            {
                "name": "Vitamin D3",
                "dosage": "2000 IU",
                "frequency": "Once daily",
                "prescribing_provider": "Dr. Sarah Kim",
                "start_date": "2026-08-15",
                "end_date": None,
                "status": Medication.Status.ACTIVE,
            },
        ]
        for med in medications:
            Medication.objects.get_or_create(
                patient=patient,
                name=med["name"],
                start_date=med["start_date"],
                defaults={
                    "dosage": med["dosage"],
                    "frequency": med["frequency"],
                    "prescribing_provider": med["prescribing_provider"],
                    "end_date": med["end_date"],
                    "status": med["status"],
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
