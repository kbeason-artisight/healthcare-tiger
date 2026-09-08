import ShieldIcon from "@mui/icons-material/Shield";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type InsuranceSummary } from "../api/client";
import PageHeader from "../components/PageHeader";

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
      <PageHeader icon={ShieldIcon} title="Insurance & Billing" subtitle="Your coverage details and cost-sharing" />
      {notFound && (
        <Card>
          <CardContent>
            <Typography color="text.secondary">No insurance information on file.</Typography>
          </CardContent>
        </Card>
      )}
      {summary && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Plan details
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Field label="Payer" value={summary.payer_name} />
              <Field label="Plan" value={summary.plan_name} />
              <Field label="Member ID" value={summary.member_id} />
              <Field label="Group number" value={summary.group_number} />
              <Field label="Effective date" value={summary.effective_date} />
            </Grid>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cost sharing
            </Typography>
            <Grid container spacing={2}>
              <Field label="Primary care copay" value={summary.copay_primary_care && `$${summary.copay_primary_care}`} />
              <Field label="Specialist copay" value={summary.copay_specialist && `$${summary.copay_specialist}`} />
              <Field
                label="Individual deductible"
                value={summary.deductible_individual && `$${summary.deductible_individual}`}
              />
              <Field label="Deductible met" value={summary.deductible_met && `$${summary.deductible_met}`} />
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
}
