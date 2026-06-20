import axios from "axios";
import { API_BASE_URL } from "../constants/api.consts";
import { ITeam } from "../interfaces/team.interface";

const API_ENDPOINTS = {
  TEAMS: "/teams/",
} as const;

export const getTeams = async (): Promise<ITeam[]> => {
  const response = await axios.get<ITeam[]>(`${API_BASE_URL}${API_ENDPOINTS.TEAMS}`);
  return response.data;
};
