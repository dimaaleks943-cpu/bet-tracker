import { ThemeMode } from "../../interfaces/theme.interface";

export const PALETTE = {
  primary: "#3390EC",
  primaryHover: "#2B7FD4",
  primarySoft: "#E8F4FD",

  primaryDark: "#5EB3F0",
  primaryHoverDark: "#7EC4F5",
  primarySoftDark: "#1A3A52",

  success: "#4CAF50",
  error: "#E53935",
  warning: "#FF9800",
  neutral: "#9E9E9E",
} as const;

export const LIGHT_THEME = {
  mode: ThemeMode.Light,
  background: "#FFFFFF",
  backgroundSecondary: "#F4F4F5",
  backgroundTertiary: "#EFEFF0",
  textPrimary: "#000000",
  textSecondary: "#707579",
  textTertiary: "#A0A0A5",
  border: "#E5E5EA",
  borderLight: "#F0F0F0",
  primary: PALETTE.primary,
  primaryHover: PALETTE.primaryHover,
  primarySoft: PALETTE.primarySoft,
  chartLine: PALETTE.primary,
  chartGrid: "#E5E5EA",
  chartTooltip: "#FFFFFF",
} as const;

export const DARK_THEME = {
  mode: ThemeMode.Dark,
  background: "#17212B",
  backgroundSecondary: "#242F3D",
  backgroundTertiary: "#2B3945",
  textPrimary: "#F5F5F5",
  textSecondary: "#8B9BAB",
  textTertiary: "#5E6D7A",
  border: "#2F3B47",
  borderLight: "#384553",
  primary: PALETTE.primaryDark,
  primaryHover: PALETTE.primaryHoverDark,
  primarySoft: PALETTE.primarySoftDark,
  chartLine: PALETTE.primaryDark,
  chartGrid: "#2F3B47",
  chartTooltip: "#242F3D",
} as const;

export const SEMANTIC_COLORS = {
  win: PALETTE.success,
  winSoftLight: "#E8F5E9",
  winSoftDark: "#1B3D1F",

  lose: PALETTE.error,
  loseSoftLight: "#FFEBEE",
  loseSoftDark: "#3D1B1B",

  return: PALETTE.neutral,
  returnSoftLight: "#F5F5F5",
  returnSoftDark: "#2A2A2A",

  cashedOut: PALETTE.warning,
  cashedOutSoftLight: "#FFF3E0",
  cashedOutSoftDark: "#3D2E1B",
} as const;
