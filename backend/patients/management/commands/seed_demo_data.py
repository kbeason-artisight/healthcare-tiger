from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from patients.models import Appointment, HealthRecord, InsuranceSummary, LabResult, Medication, Patient


class Command(BaseCommand):
    help = "Seed demo patients with sample health records, lab results, appointments, medications, and billing info."

    def handle(self, *args, **options):
        now = timezone.now()
        for spec in (self._jane_doe(now), self._anne_chovy(now)):
            self._seed_patient(spec)

        self.stdout.write(self.style.SUCCESS("Seeded demo patients: jane.doe, anne.chovy (password: demopassword123)"))

    def _seed_patient(self, spec):
        user, created = User.objects.get_or_create(
            username=spec["username"],
            defaults={
                "first_name": spec["first_name"],
                "last_name": spec["last_name"],
                "email": spec["email"],
            },
        )
        if created:
            user.set_password("demopassword123")
            user.save()

        patient, _ = Patient.objects.get_or_create(
            user=user,
            defaults={
                "mrn": spec["mrn"],
                "date_of_birth": spec["date_of_birth"],
                "gender": spec["gender"],
                "phone_number": spec["phone_number"],
                "address_line1": spec["address_line1"],
                "address_line2": spec.get("address_line2", ""),
                "city": spec["city"],
                "state": spec["state"],
                "postal_code": spec["postal_code"],
            },
        )

        for record in spec["health_records"]:
            HealthRecord.objects.get_or_create(
                patient=patient,
                title=record["title"],
                defaults={"record_type": record["record_type"], "notes": record["notes"]},
            )

        for result in spec["lab_results"]:
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

        for appt in spec["appointments"]:
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

        for med in spec["medications"]:
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

        InsuranceSummary.objects.get_or_create(patient=patient, defaults=spec["insurance"])

    def _jane_doe(self, now):
        return {
            "username": "jane.doe",
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@example.com",
            "mrn": "MRN-00042",
            "date_of_birth": "1990-04-12",
            "gender": Patient.Gender.FEMALE,
            "phone_number": "(555) 201-4487",
            "address_line1": "482 Maple Grove Lane",
            "address_line2": "",
            "city": "Springdale",
            "state": "OR",
            "postal_code": "97030",
            "health_records": [
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
            ],
            "lab_results": [
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
            ],
            "appointments": [
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
            ],
            "medications": [
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
            ],
            "insurance": {
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
        }

    def _anne_chovy(self, now):
        return {
            "username": "anne.chovy",
            "first_name": "Anne",
            "last_name": "Chovy",
            "email": "anne.chovy@example.com",
            "mrn": "MRN-00087",
            "date_of_birth": "1978-11-03",
            "gender": Patient.Gender.FEMALE,
            "phone_number": "(555) 336-9012",
            "address_line1": "17 Harbor View Court",
            "address_line2": "Unit 4B",
            "city": "Port Aldon",
            "state": "WA",
            "postal_code": "98104",
            "health_records": [
                {
                    "title": "Annual physical exam",
                    "record_type": "visit",
                    "notes": "Routine checkup. Blood pressure slightly elevated, advised to monitor.",
                },
                {
                    "title": "Shellfish allergy — anaphylaxis",
                    "record_type": "diagnosis",
                    "notes": "Emergency room visit after accidental shellfish exposure. Treated with epinephrine, observed 4 hours, discharged stable. Epinephrine auto-injector prescribed.",
                },
                {
                    "title": "Hypertension follow-up",
                    "record_type": "visit",
                    "notes": "Blood pressure improved on current medication. Continue current regimen, recheck in 6 months.",
                },
                {
                    "title": "Lower back strain — physical therapy referral",
                    "record_type": "visit",
                    "notes": "Chronic lower back pain from lifting injury. Referred to physical therapy, 6-week course recommended.",
                },
            ],
            "lab_results": [
                {
                    "test_name": "Total Cholesterol",
                    "value": "215",
                    "unit": "mg/dL",
                    "reference_range": "<200",
                    "recorded_at": now - timedelta(days=200),
                },
                {
                    "test_name": "LDL Cholesterol",
                    "value": "138",
                    "unit": "mg/dL",
                    "reference_range": "<130",
                    "recorded_at": now - timedelta(days=200),
                },
                {
                    "test_name": "Fasting Glucose",
                    "value": "98",
                    "unit": "mg/dL",
                    "reference_range": "70-99",
                    "recorded_at": now - timedelta(days=60),
                },
                {
                    "test_name": "Potassium",
                    "value": "4.3",
                    "unit": "mmol/L",
                    "reference_range": "3.5-5.0",
                    "recorded_at": now - timedelta(days=60),
                },
                {
                    "test_name": "Tryptase (allergy panel)",
                    "value": "6.8",
                    "unit": "ng/mL",
                    "reference_range": "<11.4",
                    "recorded_at": now - timedelta(days=340),
                },
            ],
            "appointments": [
                {
                    "provider_name": "Dr. Marcus Webb",
                    "reason": "Hypertension follow-up",
                    "scheduled_at": now + timedelta(days=21),
                    "location": "Main Clinic, Room 110",
                    "status": Appointment.Status.SCHEDULED,
                },
                {
                    "provider_name": "Dr. Priya Nair",
                    "reason": "Allergy & immunology consult",
                    "scheduled_at": now - timedelta(days=340),
                    "location": "Allergy Clinic, Room 3",
                    "status": Appointment.Status.COMPLETED,
                },
                {
                    "provider_name": "Physical Therapy — Alex Romero, PT",
                    "reason": "Lower back strain, session 1",
                    "scheduled_at": now - timedelta(days=14),
                    "location": "Rehab Center, Suite 200",
                    "status": Appointment.Status.COMPLETED,
                },
                {
                    "provider_name": "Physical Therapy — Alex Romero, PT",
                    "reason": "Lower back strain, session 2",
                    "scheduled_at": now + timedelta(days=7),
                    "location": "Rehab Center, Suite 200",
                    "status": Appointment.Status.SCHEDULED,
                },
            ],
            "medications": [
                {
                    "name": "Lisinopril",
                    "dosage": "20mg",
                    "frequency": "Once daily",
                    "prescribing_provider": "Dr. Marcus Webb",
                    "start_date": "2024-06-01",
                    "end_date": None,
                    "status": Medication.Status.ACTIVE,
                },
                {
                    "name": "Epinephrine Auto-Injector",
                    "dosage": "0.3mg",
                    "frequency": "As needed for anaphylaxis",
                    "prescribing_provider": "Dr. Priya Nair",
                    "start_date": "2025-01-20",
                    "end_date": None,
                    "status": Medication.Status.ACTIVE,
                },
                {
                    "name": "Atorvastatin",
                    "dosage": "10mg",
                    "frequency": "Once daily at bedtime",
                    "prescribing_provider": "Dr. Marcus Webb",
                    "start_date": "2024-06-01",
                    "end_date": "2024-09-15",
                    "status": Medication.Status.DISCONTINUED,
                },
                {
                    "name": "Cyclobenzaprine",
                    "dosage": "5mg",
                    "frequency": "Three times daily as needed",
                    "prescribing_provider": "Dr. Marcus Webb",
                    "start_date": "2026-07-10",
                    "end_date": "2026-07-31",
                    "status": Medication.Status.DISCONTINUED,
                },
                {
                    "name": "Amoxicillin",
                    "dosage": "500mg",
                    "frequency": "Twice daily",
                    "prescribing_provider": "Dr. Marcus Webb",
                    "start_date": "2023-03-05",
                    "end_date": "2023-03-15",
                    "status": Medication.Status.DISCONTINUED,
                },
            ],
            "insurance": {
                "payer_name": "Cascade Health Partners",
                "plan_name": "HMO Silver 250",
                "member_id": "CHP-441209",
                "group_number": "GRP-9013",
                "effective_date": "2026-01-01",
                "copay_primary_care": "20.00",
                "copay_specialist": "40.00",
                "deductible_individual": "250.00",
                "deductible_met": "250.00",
            },
        }
