import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type LabResult } from "../api/client";

export default function LabResults() {
  const [labResults, setLabResults] = useState<LabResult[]>([]);

  useEffect(() => {
    api.labResults().then(setLabResults);
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Lab Results
      </Typography>
      <Paper>
        <List>
          {labResults.map((result, index) => (
            <ListItem key={result.id} divider={index < labResults.length - 1}>
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
    </>
  );
}
