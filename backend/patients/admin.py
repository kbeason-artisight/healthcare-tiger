from django.contrib import admin

from .models import Appointment, HealthRecord, LabResult, Patient

admin.site.register(Patient)
admin.site.register(HealthRecord)
admin.site.register(LabResult)
admin.site.register(Appointment)
