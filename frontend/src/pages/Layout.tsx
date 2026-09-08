import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";

import { api, type Patient } from "../api/client";
import logo from "../assets/logo.svg";
import { useThemeMode } from "../theme/ThemeModeProvider";

// MUI switch customization example: https://mui.com/material-ui/react-switch/#customization
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#fff"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/></svg>`,
        )}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#fff"><path d="M480-360q-33 0-56.5-23.5T400-440q0-33 23.5-56.5T480-520q33 0 56.5 23.5T560-440q0 33-23.5 56.5T480-360ZM320-720v-80h320v80H320Z"/></svg>`,
      )}')`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

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

          <FormControlLabel
            control={
              <MaterialUISwitch
                checked={mode === "dark"}
                onChange={(event) => setMode(event.target.checked ? "dark" : "light")}
              />
            }
            label="Dark mode"
          />

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
