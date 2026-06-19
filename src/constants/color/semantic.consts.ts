import { PALETTE } from "./palette.consts";

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
