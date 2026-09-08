import PersonIcon from "@mui/icons-material/Person";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type PatientProfile } from "../api/client";
import PageHeader from "../components/PageHeader";

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
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value || "—"}
      </Typography>
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
      <PageHeader icon={PersonIcon} title="Profile" subtitle="Your personal and demographic information" />
      <Card variant="outlined">
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Identity
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Field label="Full name" value={profile.full_name} />
            <Field label="Medical record number" value={profile.mrn} />
            <Field label="Date of birth" value={profile.date_of_birth} />
            <Field label="Gender" value={GENDER_LABELS[profile.gender]} />
          </Grid>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Contact
          </Typography>
          <Grid container spacing={2}>
            <Field label="Email" value={profile.email} />
            <Field label="Phone number" value={profile.phone_number} />
            <Field label="Address" value={address} />
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
