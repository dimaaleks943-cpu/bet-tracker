import { createTheme } from "@mui/material";
import { LIGHT_THEME } from "../constants/color/lightTheme.consts";
import { DARK_THEME } from "../constants/color/darkTheme.consts";
import { SEMANTIC_COLORS } from "../constants/color/semantic.consts";
import { ThemeMode } from "../interfaces/theme.interface";

export const createAppTheme = (mode: ThemeMode) => {
  const tokens = mode === "light" ? LIGHT_THEME : DARK_THEME;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        dark: tokens.primaryHover,
      },
      background: {
        default: tokens.background,
        paper: tokens.backgroundSecondary,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
        disabled: tokens.textTertiary,
      },
      divider: tokens.border,
      success: { main: SEMANTIC_COLORS.win },
      error: { main: SEMANTIC_COLORS.lose },
      warning: { main: SEMANTIC_COLORS.cashedOut },
      custom: {
        backgroundTertiary: tokens.backgroundTertiary,
        border: tokens.border,
        borderLight: tokens.borderLight,
        primarySoft: tokens.primarySoft,
        chartLine: tokens.chartLine,
        chartGrid: tokens.chartGrid,
        chartTooltip: tokens.chartTooltip,
      },
      betStatus: {
        win: SEMANTIC_COLORS.win,
        lose: SEMANTIC_COLORS.lose,
        return: SEMANTIC_COLORS.return,
        cashedOut: SEMANTIC_COLORS.cashedOut,
      },
    },
    typography: {
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: tokens.background,
            color: tokens.textPrimary,
          },
          a: {
            color: tokens.primary,
            textDecoration: "none",
            "&:hover": {
              color: tokens.primaryHover,
            },
          },
        },
      },
    },
  });
};
