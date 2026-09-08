import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "healthcare-tiger-theme-mode";

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private browsing, etc.)
    }
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#e8791a", contrastText: "#ffffff" },
          secondary: { main: "#2f7a5c" },
          background:
            mode === "light"
              ? { default: "#fdf6ee", paper: "#ffffff" }
              : { default: "#1b1712", paper: "#26211a" },
        },
        shape: { borderRadius: 16 },
        typography: {
          fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
          h5: { fontWeight: 800 },
          h6: { fontWeight: 700 },
        },
        components: {
          MuiCard: {
            defaultProps: { variant: "elevation" },
            styleOverrides: {
              root: {
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 999, textTransform: "none", fontWeight: 700 },
            },
          },
          MuiChip: {
            styleOverrides: { root: { fontWeight: 700 } },
          },
          MuiAppBar: {
            styleOverrides: {
              root: { backgroundColor: "#e8791a" },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return ctx;
}
