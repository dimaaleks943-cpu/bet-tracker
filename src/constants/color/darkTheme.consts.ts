import { PALETTE } from "./palette.consts";

export const DARK_THEME = {
  mode: "dark" as const,
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
