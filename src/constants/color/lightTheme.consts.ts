import { PALETTE } from "./palette.consts";

export const LIGHT_THEME = {
  mode: "light" as const,
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
