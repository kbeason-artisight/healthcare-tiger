import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type HealthRecord } from "../api/client";

export default function HealthRecords() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    api.healthRecords().then(setHealthRecords);
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Health Records
      </Typography>
      <Paper>
        <List>
          {healthRecords.map((record) => (
            <ListItem key={record.id} divider>
              <ListItemText
                primary={record.title}
                secondary={`${record.record_type} — ${new Date(record.created_at).toLocaleDateString()}${
                  record.notes ? ` — ${record.notes}` : ""
                }`}
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
    </>
  );
}
