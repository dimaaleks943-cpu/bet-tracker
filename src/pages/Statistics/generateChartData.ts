import { BetStatus, IBet } from "../../interfaces/bet.interface";

export interface IChartDataPoint {
  name: string;
  balance: number;
  event: string;
  market: string;
  stake: number;
}

export const generateChartData = (bets: IBet[]): IChartDataPoint[] => {
  let balance = 0;

  return bets.map((bet) => {
    let profit = 0;

    if (bet.status === BetStatus.Win || bet.status === BetStatus.CashedOut) {
      profit = bet.payout - bet.stake;
    } else if (bet.status === BetStatus.Lose) {
      profit = -bet.stake;
    } else if (bet.status === BetStatus.Return) {
      profit = 0;
    }

    balance += profit;

    return {
      name: `#${bet.id}`,
      balance: parseFloat(balance.toFixed(2)),
      event: bet.match,
      market: bet.market,
      stake: bet.stake,
    };
  });
};
