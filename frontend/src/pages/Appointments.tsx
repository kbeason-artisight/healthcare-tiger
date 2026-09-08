import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type Appointment } from "../api/client";
import PageHeader from "../components/PageHeader";

const STATUS_COLOR: Record<Appointment["status"], "primary" | "success" | "default"> = {
  scheduled: "primary",
  completed: "success",
  cancelled: "default",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api.appointments().then(setAppointments);
  }, []);

  return (
    <>
      <PageHeader icon={EventIcon} title="Appointments" subtitle="Upcoming and past visits with your care team" />
      <Stack spacing={2}>
        {appointments.map((appt) => (
          <Card key={appt.id} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                  <EventIcon fontSize="small" />
                </Avatar>
                <Stack spacing={0.5} flexGrow={1} minWidth={0}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {appt.provider_name}
                    </Typography>
                    <Chip size="small" label={appt.status} color={STATUS_COLOR[appt.status]} />
                  </Stack>
                  <Typography variant="body2">{appt.reason}</Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(appt.scheduled_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocationOnIcon fontSize="inherit" color="disabled" />
                      <Typography variant="body2" color="text.secondary">
                        {appt.location}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {appointments.length === 0 && <Typography color="text.secondary">No appointments scheduled.</Typography>}
      </Stack>
    </>
  );
}
