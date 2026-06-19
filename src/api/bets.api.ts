import axios from "axios";
import { API_BASE_URL } from "../constants/api.consts";
import { IBet, ICreateBetPayload, IUpdateBetPayload } from "../interfaces/bet.interface";

const API_ENDPOINTS = {
  BETS: "/bets/",
  BET_BY_ID: (id: number) => `/bets/${id}/`,
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

export const updateBet = async (id: number, payload: IUpdateBetPayload): Promise<IBet> => {
  const response = await axios.patch<IBet>(
    `${API_BASE_URL}${API_ENDPOINTS.BET_BY_ID(id)}`,
    payload
  );
  return response.data;
};

export const deleteBet = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.BET_BY_ID(id)}`);
};
