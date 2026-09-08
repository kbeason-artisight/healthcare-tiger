import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";

import { api, type Patient } from "../api/client";
import logo from "../assets/logo.svg";

const NAV_LINKS = [
  { to: "/health-records", label: "Health Records" },
  { to: "/lab-results", label: "Lab Results" },
  { to: "/appointments", label: "Appointments" },
  { to: "/medications", label: "Medications" },
  { to: "/billing", label: "Billing" },
];

export default function Layout({ patient, onLogout }: { patient: Patient; onLogout: () => void }) {
  const location = useLocation();

  async function handleLogout() {
    await api.logout();
    onLogout();
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mr: 2 }}>
              <Box component="img" src={logo} alt="Healthcare Tiger" sx={{ width: 36, height: 36 }} />
              <Typography variant="h6" fontWeight={700}>
                Healthcare Tiger
              </Typography>
            </Box>
            <Typography variant="body1">{patient.full_name}</Typography>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Button
                  key={link.to}
                  color="inherit"
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    fontWeight: isActive ? 700 : 400,
                    borderBottom: isActive ? 2 : 2,
                    borderColor: isActive ? "common.white" : "transparent",
                    borderStyle: "solid",
                    borderRadius: 0,
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>
          <Button color="inherit" onClick={handleLogout}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
