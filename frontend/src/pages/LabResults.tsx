import ScienceIcon from "@mui/icons-material/Science";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type LabResult } from "../api/client";
import PageHeader from "../components/PageHeader";

export default function LabResults() {
  const [labResults, setLabResults] = useState<LabResult[]>([]);

  useEffect(() => {
    api.labResults().then(setLabResults);
  }, []);

  return (
    <>
      <PageHeader icon={ScienceIcon} title="Lab Results" subtitle="Recorded values from your recent lab work" />
      <Stack spacing={2}>
        {labResults.map((result) => (
          <Card key={result.id} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                  <ScienceIcon fontSize="small" />
                </Avatar>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexGrow={1} minWidth={0} flexWrap="wrap" gap={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {result.test_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reference range: {result.reference_range}
                      {" · "}
                      {new Date(result.recorded_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={700} whiteSpace="nowrap">
                    {result.value} {result.unit}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {labResults.length === 0 && <Typography color="text.secondary">No lab results yet.</Typography>}
      </Stack>
    </>
  );
}
