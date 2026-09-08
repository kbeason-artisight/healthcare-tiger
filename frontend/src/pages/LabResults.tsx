import ScienceIcon from "@mui/icons-material/Science";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type LabResult } from "../api/client";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";

function dateKey(isoString: string): string {
  return isoString.slice(0, 10);
}

export default function LabResults() {
  const [labResults, setLabResults] = useState<LabResult[]>([]);

  useEffect(() => {
    api.labResults().then(setLabResults);
  }, []);

  const sorted = [...labResults].sort(
    (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
  );

  const groups: { key: string; label: string; results: LabResult[] }[] = [];
  for (const result of sorted) {
    const key = dateKey(result.recorded_at);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.key === key) {
      lastGroup.results.push(result);
    } else {
      groups.push({
        key,
        label: new Date(result.recorded_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        results: [result],
      });
    }
  }

  return (
    <>
      <PageHeader icon={ScienceIcon} title="Lab Results" subtitle="Recorded values from your recent lab work" />
      {groups.map((group) => (
        <Stack key={group.key} spacing={2} sx={{ mb: 4 }}>
          <SectionHeading>{group.label}</SectionHeading>
          <Stack spacing={2}>
            {group.results.map((result) => (
              <Card key={result.id}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                      <ScienceIcon fontSize="small" />
                    </Avatar>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      flexGrow={1}
                      minWidth={0}
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {result.test_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reference range: {result.reference_range}
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
          </Stack>
        </Stack>
      ))}
      {groups.length === 0 && <Typography color="text.secondary">No lab results yet.</Typography>}
    </>
  );
}
