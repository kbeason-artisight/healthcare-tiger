from django.urls import path

from . import views

urlpatterns = [
    path("auth/csrf/", views.CsrfView.as_view(), name="csrf"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/logout/", views.LogoutView.as_view(), name="logout"),
    path("me/", views.MeView.as_view(), name="me"),
    path("health-records/", views.HealthRecordListView.as_view(), name="health-records"),
    path("lab-results/", views.LabResultListView.as_view(), name="lab-results"),
    path("appointments/", views.AppointmentListView.as_view(), name="appointments"),
    path("medications/", views.MedicationListView.as_view(), name="medications"),
    path("insurance-summary/", views.InsuranceSummaryView.as_view(), name="insurance-summary"),
]
