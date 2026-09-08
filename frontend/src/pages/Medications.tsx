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

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    api.medications().then(setMedications);
  }, []);

  return (
    <>
      <PageHeader icon={MedicationIcon} title="Medications" subtitle="Current and past prescriptions on file" />
      <Stack spacing={2}>
        {medications.map((med) => (
          <Card key={med.id} variant="outlined">
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
                    <Chip
                      size="small"
                      label={med.status}
                      color={med.status === "active" ? "success" : "default"}
                    />
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
        ))}
        {medications.length === 0 && <Typography color="text.secondary">No medications on file.</Typography>}
      </Stack>
    </>
  );
}
