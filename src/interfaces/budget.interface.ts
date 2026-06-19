import { Currency } from "./bet.interface";

export enum TransactionType {
  Initial = "initial",
  Deposit = "deposit",
  Withdrawal = "withdrawal",
}

export interface ITransaction {
  id: number;
  type: TransactionType;
  amount: number;
  currency: Currency;
  date: string;
  comment?: string;
}

export interface ICreateTransactionPayload {
  type: TransactionType;
  amount: number;
  currency: Currency;
  date: string;
  comment?: string;
}

export interface IBalanceSummary {
  initialBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  bettingProfit: number;
  currentBalance: number;
  currency: Currency;
}
