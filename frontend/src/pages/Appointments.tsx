import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type Appointment } from "../api/client";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api.appointments().then(setAppointments);
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
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
