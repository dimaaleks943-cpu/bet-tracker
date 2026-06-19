import { BetStatus, IBet } from "../interfaces/bet.interface";

export const calculateBetProfit = (bet: IBet): number => {
  if (bet.status === BetStatus.Pending) {
    return 0;
  }
  if (bet.status === BetStatus.Win || bet.status === BetStatus.CashedOut) {
    return bet.payout - bet.stake;
  }
  if (bet.status === BetStatus.Lose) {
    return -bet.stake;
  }
  return 0;
};

export const calculateBettingProfit = (bets: IBet[]): number => {
  return bets.reduce((sum, bet) => sum + calculateBetProfit(bet), 0);
};
