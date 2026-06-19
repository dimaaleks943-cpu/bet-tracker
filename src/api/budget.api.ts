import axios from "axios";
import { API_BASE_URL } from "../constants/api.consts";
import {
  IBalanceSummary,
  ICreateTransactionPayload,
  ITransaction,
} from "../interfaces/budget.interface";

const API_ENDPOINTS = {
  TRANSACTIONS: "/budget/transactions/",
  SUMMARY: "/budget/summary/",
} as const;

export const getTransactions = async (): Promise<ITransaction[]> => {
  const response = await axios.get<ITransaction[]>(
    `${API_BASE_URL}${API_ENDPOINTS.TRANSACTIONS}`
  );
  return response.data;
};

export const createTransaction = async (
  payload: ICreateTransactionPayload
): Promise<{ id: number }> => {
  const response = await axios.post<{ id: number }>(
    `${API_BASE_URL}${API_ENDPOINTS.TRANSACTIONS}`,
    payload
  );
  return response.data;
};

export const getBalanceSummary = async (): Promise<IBalanceSummary> => {
  const response = await axios.get<IBalanceSummary>(
    `${API_BASE_URL}${API_ENDPOINTS.SUMMARY}`
  );
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.TRANSACTIONS}${id}/`);
};
