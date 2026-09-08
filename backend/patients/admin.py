from django.contrib import admin

from .models import Appointment, HealthRecord, InsuranceSummary, LabResult, Medication, Patient

admin.site.register(Patient)
admin.site.register(HealthRecord)
admin.site.register(LabResult)
admin.site.register(Appointment)
admin.site.register(Medication)
admin.site.register(InsuranceSummary)
