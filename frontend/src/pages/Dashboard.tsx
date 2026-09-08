import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type HealthRecord, type LabResult, type Patient } from "../api/client";

export default function Dashboard({ patient, onLogout }: { patient: Patient; onLogout: () => void }) {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);

  useEffect(() => {
    api.healthRecords().then(setHealthRecords);
    api.labResults().then(setLabResults);
  }, []);

  async function handleLogout() {
    await api.logout();
    onLogout();
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Welcome, {patient.full_name}</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          MRN: {patient.mrn}
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Health Records
        </Typography>
        <Paper>
          <List>
            {healthRecords.map((record) => (
              <ListItem key={record.id} divider>
                <ListItemText
                  primary={record.title}
                  secondary={`${record.record_type} — ${new Date(record.created_at).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
            {healthRecords.length === 0 && (
              <ListItem>
                <ListItemText primary="No health records yet." />
              </ListItem>
            )}
          </List>
        </Paper>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Lab Results
        </Typography>
        <Paper>
          <List>
            {labResults.map((result) => (
              <ListItem key={result.id} divider>
                <ListItemText
                  primary={`${result.test_name}: ${result.value} ${result.unit}`}
                  secondary={`Reference range: ${result.reference_range} — ${new Date(
                    result.recorded_at
                  ).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
            {labResults.length === 0 && (
              <ListItem>
                <ListItemText primary="No lab results yet." />
              </ListItem>
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
