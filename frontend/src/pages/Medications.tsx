import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { api, type Medication } from "../api/client";

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    api.medications().then(setMedications);
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Medications
      </Typography>
      <Paper>
        <List>
          {medications.map((med) => (
            <ListItem key={med.id} divider>
              <ListItemText
                primary={
                  <>
                    {med.name} {med.dosage && `— ${med.dosage}`}{" "}
                    <Chip
                      size="small"
                      label={med.status}
                      color={med.status === "active" ? "success" : "default"}
                      sx={{ ml: 1 }}
                    />
                  </>
                }
                secondary={`${med.frequency || "As directed"} · Prescribed by ${
                  med.prescribing_provider || "unknown provider"
                } · started ${med.start_date}${med.end_date ? ` · ended ${med.end_date}` : ""}`}
              />
            </ListItem>
          ))}
          {medications.length === 0 && (
            <ListItem>
              <ListItemText primary="No medications on file." />
            </ListItem>
          )}
        </List>
      </Paper>
    </>
  );
}
