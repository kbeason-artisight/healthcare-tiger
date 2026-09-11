import GroupIcon from "@mui/icons-material/Group";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  api,
  type Appointment,
  type HealthRecord,
  type InsuranceSummary,
  type LabResult,
  type Medication,
  type PatientProfile,
} from "../api/client";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";

interface SharedData {
  healthRecords: HealthRecord[];
  labResults: LabResult[];
  appointments: Appointment[];
  medications: Medication[];
  insurance: InsuranceSummary | null;
}

export default function SharedRecords() {
  const { shareId } = useParams<{ shareId: string }>();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [data, setData] = useState<SharedData | null>(null);

  useEffect(() => {
    if (!shareId) return;
    const id = Number(shareId);
    api.sharedLink(id).then(setPatient).catch(() => {});
    Promise.all([
      api.sharedHealthRecords(id).catch(() => []),
      api.sharedLabResults(id).catch(() => []),
      api.sharedAppointments(id).catch(() => []),
      api.sharedMedications(id).catch(() => []),
      api.sharedInsuranceSummary(id).catch(() => null),
    ]).then(([healthRecords, labResults, appointments, medications, insurance]) =>
      setData({ healthRecords, labResults, appointments, medications, insurance }),
    );
  }, [shareId]);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        icon={GroupIcon}
        title={`${patient?.full_name}'s shared records`}
        subtitle={[
          `MRN ${patient?.mrn}`,
          patient?.date_of_birth && `DOB ${patient.date_of_birth}`,
          patient?.gender,
          patient?.phone_number,
        ]
          .filter(Boolean)
          .join(" · ")}
      />
      {data && (
        <Stack spacing={4}>
          <Stack spacing={2}>
            <SectionHeading>Health Records</SectionHeading>
            {data.healthRecords.map((record) => (
              <Card key={record.id}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {record.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.notes}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {data.healthRecords.length === 0 && (
              <Typography color="text.secondary">No health records shared.</Typography>
            )}
          </Stack>

          <Stack spacing={2}>
            <SectionHeading>Lab Results</SectionHeading>
            {data.labResults.map((result) => (
              <Card key={result.id}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {result.test_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.value} {result.unit} (ref: {result.reference_range})
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {data.labResults.length === 0 && <Typography color="text.secondary">No lab results shared.</Typography>}
          </Stack>

          <Stack spacing={2}>
            <SectionHeading>Appointments</SectionHeading>
            {data.appointments.map((appt) => (
              <Card key={appt.id}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {appt.provider_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appt.reason} — {new Date(appt.scheduled_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {data.appointments.length === 0 && (
              <Typography color="text.secondary">No appointments shared.</Typography>
            )}
          </Stack>

          <Stack spacing={2}>
            <SectionHeading>Medications</SectionHeading>
            {data.medications.map((med) => (
              <Card key={med.id}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {med.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {med.dosage} · {med.frequency}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {data.medications.length === 0 && <Typography color="text.secondary">No medications shared.</Typography>}
          </Stack>

          {data.insurance && (
            <Stack spacing={2}>
              <SectionHeading>Billing</SectionHeading>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {data.insurance.payer_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member ID {data.insurance.member_id} · Plan {data.insurance.plan_name}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}
        </Stack>
      )}
    </Container>
  );
}
