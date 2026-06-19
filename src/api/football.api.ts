import axios from "axios";
import { FOOTBALL_DATA_API_KEY, FOOTBALL_DATA_BASE_URL } from "../constants/api.consts";
import {
  IFootballCompetitionsResponse,
  IFootballMatchesResponse,
  IFootballStandingsResponse,
} from "../interfaces/football.interface";

const footballClient = axios.create({
  baseURL: FOOTBALL_DATA_BASE_URL,
  headers: {
    "X-Auth-Token": FOOTBALL_DATA_API_KEY,
  },
});

export const getCompetitions = async (): Promise<IFootballCompetitionsResponse> => {
  const response = await footballClient.get<IFootballCompetitionsResponse>("/competitions");
  return response.data;
};

export const getCompetitionMatches = async (
  code: string
): Promise<IFootballMatchesResponse> => {
  const response = await footballClient.get<IFootballMatchesResponse>(
    `/competitions/${code}/matches`
  );
  return response.data;
};

export const getCompetitionStandings = async (
  code: string
): Promise<IFootballStandingsResponse> => {
  const response = await footballClient.get<IFootballStandingsResponse>(
    `/competitions/${code}/standings`
  );
  return response.data;
};
