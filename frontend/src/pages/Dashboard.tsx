import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type Appointment, type HealthRecord, type LabResult, type Patient } from "../api/client";

export default function Dashboard({ patient }: { patient: Patient }) {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api.healthRecords().then(setHealthRecords);
    api.labResults().then(setLabResults);
    api.appointments().then(setAppointments);
  }, []);

  return (
    <>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        MRN: {patient.mrn}
      </Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Health Records
      </Typography>
      <Paper>
        <List>
          {healthRecords.map((record) => (
            <ListItem key={record.id} divider>
              <ListItemText
                primary={record.title}
                secondary={`${record.record_type} — ${new Date(record.created_at).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
          {healthRecords.length === 0 && (
            <ListItem>
              <ListItemText primary="No health records yet." />
            </ListItem>
          )}
        </List>
      </Paper>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Lab Results
      </Typography>
      <Paper>
        <List>
          {labResults.map((result) => (
            <ListItem key={result.id} divider>
              <ListItemText
                primary={`${result.test_name}: ${result.value} ${result.unit}`}
                secondary={`Reference range: ${result.reference_range} — ${new Date(
                  result.recorded_at
                ).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
          {labResults.length === 0 && (
            <ListItem>
              <ListItemText primary="No lab results yet." />
            </ListItem>
          )}
        </List>
      </Paper>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Appointments
      </Typography>
      <Paper>
        <List>
          {appointments.map((appt) => (
            <ListItem key={appt.id} divider>
              <ListItemText
                primary={`${appt.provider_name} — ${appt.reason}`}
                secondary={`${new Date(appt.scheduled_at).toLocaleString()} · ${appt.location} · ${appt.status}`}
              />
            </ListItem>
          ))}
          {appointments.length === 0 && (
            <ListItem>
              <ListItemText primary="No appointments scheduled." />
            </ListItem>
          )}
        </List>
      </Paper>
    </>
  );
}
