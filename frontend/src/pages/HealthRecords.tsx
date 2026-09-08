import DescriptionIcon from "@mui/icons-material/Description";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type HealthRecord } from "../api/client";
import PageHeader from "../components/PageHeader";

export default function HealthRecords() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    api.healthRecords().then(setHealthRecords);
  }, []);

  return (
    <>
      <PageHeader
        icon={DescriptionIcon}
        title="Health Records"
        subtitle="Visit summaries and notes from your care team"
      />
      <Stack spacing={2}>
        {healthRecords.map((record) => (
          <Card key={record.id} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                  <DescriptionIcon fontSize="small" />
                </Avatar>
                <Stack spacing={0.5} flexGrow={1} minWidth={0}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {record.title}
                    </Typography>
                    <Chip size="small" label={record.record_type} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(record.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  {record.notes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {record.notes}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {healthRecords.length === 0 && <Typography color="text.secondary">No health records yet.</Typography>}
      </Stack>
    </>
  );
}
