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
    path("profile/", views.PatientProfileView.as_view(), name="profile"),
    path("shares/", views.RecordShareListCreateView.as_view(), name="shares"),
    path("shared/<int:share_id>/", views.SharedLinkView.as_view(), name="shared-link"),
    path(
        "shared/<int:share_id>/health-records/",
        views.SharedHealthRecordListView.as_view(),
        name="shared-health-records",
    ),
    path(
        "shared/<int:share_id>/lab-results/",
        views.SharedLabResultListView.as_view(),
        name="shared-lab-results",
    ),
    path(
        "shared/<int:share_id>/appointments/",
        views.SharedAppointmentListView.as_view(),
        name="shared-appointments",
    ),
    path(
        "shared/<int:share_id>/medications/",
        views.SharedMedicationListView.as_view(),
        name="shared-medications",
    ),
    path(
        "shared/<int:share_id>/insurance-summary/",
        views.SharedInsuranceSummaryView.as_view(),
        name="shared-insurance-summary",
    ),
]
