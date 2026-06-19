export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export const FOOTBALL_DATA_BASE_URL = import.meta.env.DEV
  ? "/football-api"
  : "https://api.football-data.org/v4";

export const FOOTBALL_DATA_API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY ?? "";
