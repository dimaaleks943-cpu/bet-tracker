export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      backgroundTertiary: string;
      border: string;
      borderLight: string;
      primarySoft: string;
      chartLine: string;
      chartGrid: string;
      chartTooltip: string;
    };
    betStatus: {
      win: string;
      lose: string;
      return: string;
      cashedOut: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      backgroundTertiary?: string;
      border?: string;
      borderLight?: string;
      primarySoft?: string;
      chartLine?: string;
      chartGrid?: string;
      chartTooltip?: string;
    };
    betStatus?: {
      win?: string;
      lose?: string;
      return?: string;
      cashedOut?: string;
    };
  }
}
