import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type PatientProfile } from "../api/client";

const GENDER_LABELS: Record<PatientProfile["gender"], string> = {
  female: "Female",
  male: "Male",
  nonbinary: "Non-binary",
  other: "Other",
  undisclosed: "Prefer not to say",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <Grid item xs={12} sm={6}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">{value || "—"}</Typography>
    </Grid>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    api.profile().then(setProfile);
  }, []);

  if (!profile) {
    return null;
  }

  const address = [
    profile.address_line1,
    profile.address_line2,
    [profile.city, profile.state].filter(Boolean).join(", "),
    profile.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Field label="Full name" value={profile.full_name} />
          <Field label="Medical record number" value={profile.mrn} />
          <Field label="Date of birth" value={profile.date_of_birth} />
          <Field label="Gender" value={GENDER_LABELS[profile.gender]} />
          <Field label="Email" value={profile.email} />
          <Field label="Phone number" value={profile.phone_number} />
          <Field label="Address" value={address} />
        </Grid>
      </Paper>
    </>
  );
}
