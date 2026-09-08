import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";

import { api, type Patient } from "../api/client";
import logo from "../assets/logo.svg";
import { useThemeMode } from "../theme/ThemeModeProvider";

const NAV_LINKS = [
  { to: "/health-records", label: "Health Records" },
  { to: "/lab-results", label: "Lab Results" },
  { to: "/appointments", label: "Appointments" },
  { to: "/medications", label: "Medications" },
  { to: "/billing", label: "Billing" },
  { to: "/profile", label: "Profile" },
];

export default function Layout({ patient, onLogout }: { patient: Patient; onLogout: () => void }) {
  const location = useLocation();
  const { mode, setMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  async function handleLogout() {
    await api.logout();
    setAnchorEl(null);
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
                    borderBottom: 2,
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
          <IconButton
            color="inherit"
            aria-label="Account"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Stack spacing={3} sx={{ p: 3, minWidth: 260 }}>
          <Typography variant="body1">{patient.full_name}</Typography>

          <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Theme
            </Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              size="small"
              onChange={(_event, next) => {
                if (next) setMode(next);
              }}
            >
              <ToggleButton value="light">
                <LightModeIcon fontSize="small" sx={{ mr: 1 }} />
                Light
              </ToggleButton>
              <ToggleButton value="dark">
                <DarkModeIcon fontSize="small" sx={{ mr: 1 }} />
                Dark
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />

          <Button onClick={handleLogout} color="error" sx={{ alignSelf: "flex-start" }}>
            Sign out
          </Button>
        </Stack>
      </Popover>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
