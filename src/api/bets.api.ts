import axios from "axios";
import { IBet, ICreateBetPayload } from "../interfaces/bet.interface";

const API_BASE_URL = "http://127.0.0.1:8000";

const API_ENDPOINTS = {
  BETS: "/bets/",
} as const;

export const getBets = async (): Promise<IBet[]> => {
  const response = await axios.get<IBet[]>(`${API_BASE_URL}${API_ENDPOINTS.BETS}`);
  return response.data;
};

export const createBet = async (payload: ICreateBetPayload): Promise<{ id: number }> => {
  const response = await axios.post<{ id: number }>(
    `${API_BASE_URL}${API_ENDPOINTS.BETS}`,
    payload
  );
  return response.data;
};
