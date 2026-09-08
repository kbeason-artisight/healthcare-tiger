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
import SectionHeading from "../components/SectionHeading";

function dateKey(isoString: string): string {
  return isoString.slice(0, 10);
}

export default function HealthRecords() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    api.healthRecords().then(setHealthRecords);
  }, []);

  const sorted = [...healthRecords].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const groups: { key: string; label: string; records: HealthRecord[] }[] = [];
  for (const record of sorted) {
    const key = dateKey(record.created_at);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.key === key) {
      lastGroup.records.push(record);
    } else {
      groups.push({
        key,
        label: new Date(record.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        records: [record],
      });
    }
  }

  return (
    <>
      <PageHeader
        icon={DescriptionIcon}
        title="Health Records"
        subtitle="Visit summaries and notes from your care team"
      />
      {groups.map((group) => (
        <Stack key={group.key} spacing={2} sx={{ mb: 4 }}>
          <SectionHeading>{group.label}</SectionHeading>
          <Stack spacing={2}>
            {group.records.map((record) => (
              <Card key={record.id}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                      <DescriptionIcon fontSize="small" />
                    </Avatar>
                    <Stack spacing={0.5} flexGrow={1} minWidth={0}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {record.title}
                        </Typography>
                        <Chip size="small" label={record.record_type} />
                      </Stack>
                      {record.notes && <Typography variant="body2">{record.notes}</Typography>}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      ))}
      {groups.length === 0 && <Typography color="text.secondary">No health records yet.</Typography>}
    </>
  );
}
