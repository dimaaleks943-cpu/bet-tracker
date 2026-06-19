import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createAppTheme } from "../theme/createAppTheme";
import { ThemeMode } from "../interfaces/theme.interface";
import { MESSAGES } from "../constants/messages.consts";

const THEME_STORAGE_KEY = "bet-tracker-theme";

const PREFERS_COLOR_SCHEME_DARK = "(prefers-color-scheme: dark)";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === ThemeMode.Light || value === ThemeMode.Dark;
};

const getInitialMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeMode(stored)) {
    return stored;
  }
  return window.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches
    ? ThemeMode.Dark
    : ThemeMode.Light;
};

interface ThemeModeProviderProps {
  children: ReactNode;
}

export const ThemeModeProvider = ({ children }: ThemeModeProviderProps) => {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light));
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(
    () => ({ mode, toggleTheme, setMode }),
    [mode, toggleTheme, setMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error(MESSAGES.THEME_MODE_PROVIDER_ERROR);
  }
  return context;
};
