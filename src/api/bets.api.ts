import axios from "axios";
import { API_BASE_URL } from "../constants/api.consts";
import { IBet, ICreateBetPayload } from "../interfaces/bet.interface";

export const getBets = async (): Promise<IBet[]> => {
  const response = await axios.get<IBet[]>(`${API_BASE_URL}/bets/`);
  return response.data;
};

export const createBet = async (payload: ICreateBetPayload): Promise<{ id: number }> => {
  const response = await axios.post<{ id: number }>(`${API_BASE_URL}/bets/`, payload);
  return response.data;
};
