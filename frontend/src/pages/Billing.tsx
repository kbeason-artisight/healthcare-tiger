import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type InsuranceSummary } from "../api/client";

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

export default function Billing() {
  const [summary, setSummary] = useState<InsuranceSummary | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .insuranceSummary()
      .then(setSummary)
      .catch(() => setNotFound(true));
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Insurance &amp; Billing
      </Typography>
      <Paper sx={{ p: 3 }}>
        {notFound && <Typography>No insurance information on file.</Typography>}
        {summary && (
          <Grid container spacing={2}>
            <Field label="Payer" value={summary.payer_name} />
            <Field label="Plan" value={summary.plan_name} />
            <Field label="Member ID" value={summary.member_id} />
            <Field label="Group number" value={summary.group_number} />
            <Field label="Effective date" value={summary.effective_date} />
            <Field label="Primary care copay" value={summary.copay_primary_care && `$${summary.copay_primary_care}`} />
            <Field label="Specialist copay" value={summary.copay_specialist && `$${summary.copay_specialist}`} />
            <Field
              label="Individual deductible"
              value={summary.deductible_individual && `$${summary.deductible_individual}`}
            />
            <Field label="Deductible met" value={summary.deductible_met && `$${summary.deductible_met}`} />
          </Grid>
        )}
      </Paper>
    </>
  );
}
