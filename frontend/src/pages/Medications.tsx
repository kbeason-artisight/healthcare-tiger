import MedicationIcon from "@mui/icons-material/Medication";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type Medication } from "../api/client";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";

function MedicationCard({ med }: { med: Medication }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
            <MedicationIcon fontSize="small" />
          </Avatar>
          <Stack spacing={0.5} flexGrow={1} minWidth={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                {med.name}
                {med.dosage && (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {med.dosage}
                  </Typography>
                )}
              </Typography>
              <Chip size="small" label={med.status} color={med.status === "active" ? "success" : "default"} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {med.frequency || "As directed"} · Prescribed by {med.prescribing_provider || "unknown provider"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Started {med.start_date}
              {med.end_date ? ` · Ended ${med.end_date}` : ""}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    api.medications().then(setMedications);
  }, []);

  const active = medications.filter((med) => med.status === "active");
  const discontinued = medications.filter((med) => med.status !== "active");

  return (
    <>
      <PageHeader icon={MedicationIcon} title="Medications" subtitle="Current and past prescriptions on file" />

      <SectionHeading>Active</SectionHeading>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {active.map((med) => (
          <MedicationCard key={med.id} med={med} />
        ))}
        {active.length === 0 && <Typography color="text.secondary">No active medications.</Typography>}
      </Stack>

      <SectionHeading>Discontinued</SectionHeading>
      <Stack spacing={2}>
        {discontinued.map((med) => (
          <MedicationCard key={med.id} med={med} />
        ))}
        {discontinued.length === 0 && <Typography color="text.secondary">No discontinued medications.</Typography>}
      </Stack>
    </>
  );
}
