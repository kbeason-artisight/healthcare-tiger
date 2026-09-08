from django.contrib import admin

from .models import HealthRecord, LabResult, Patient

admin.site.register(Patient)
admin.site.register(HealthRecord)
admin.site.register(LabResult)
