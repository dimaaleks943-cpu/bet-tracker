import { IBet } from "../../interfaces/bet.interface";
import { IChartDataPoint } from "./statistics.interface";

export const generateChartData = (bets: IBet[]): IChartDataPoint[] => {
  let balance = 0;

  return bets.map((bet) => {
    let profit = 0;

    if (bet.status === "win" || bet.status === "cashed_out") {
      profit = bet.payout - bet.stake;
    } else if (bet.status === "lose") {
      profit = -bet.stake;
    } else if (bet.status === "return") {
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
