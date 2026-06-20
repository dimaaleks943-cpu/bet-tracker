import { BetStatus, formatBetTeams, IBet } from "../interfaces/bet.interface";
import { ITransaction, TransactionType } from "../interfaces/budget.interface";
import { calculateBetProfit, calculateBettingProfit } from "./calculateBetProfit";

export interface IBalanceTimelinePoint {
  id: string;
  date: string;
  label: string;
  balance: number;
  eventType: "bet" | "transaction";
  description: string;
  detail?: string;
}

const sortByDate = (a: { date: string }, b: { date: string }) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

export const buildBalanceTimeline = (
  bets: IBet[],
  transactions: ITransaction[]
): IBalanceTimelinePoint[] => {
  const events: Array<Omit<IBalanceTimelinePoint, "balance">> = [];

  bets.forEach((bet) => {
    if (bet.status === BetStatus.Pending) {
      return;
    }
    events.push({
      id: `bet-${bet.id}`,
      date: bet.date,
      label: `#${bet.id}`,
      eventType: "bet",
      description: formatBetTeams(bet),
      detail: `${bet.market} · ${bet.stake} ${bet.currency}`,
    });
  });

  transactions.forEach((tx) => {
    events.push({
      id: `tx-${tx.id}`,
      date: tx.date,
      label: tx.type,
      eventType: "transaction",
      description: tx.comment ?? tx.type,
      detail: `${tx.amount} ${tx.currency}`,
    });
  });

  events.sort(sortByDate);

  let balance = 0;
  const points: IBalanceTimelinePoint[] = [];

  events.forEach((event) => {
    if (event.eventType === "transaction") {
      const tx = transactions.find((t) => `tx-${t.id}` === event.id);
      if (tx) {
        if (tx.type === TransactionType.Initial || tx.type === TransactionType.Deposit) {
          balance += tx.amount;
        } else if (tx.type === TransactionType.Withdrawal) {
          balance -= tx.amount;
        }
      }
    } else {
      const bet = bets.find((b) => `bet-${b.id}` === event.id);
      if (bet) {
        balance += calculateBetProfit(bet);
      }
    }

    points.push({
      ...event,
      balance: parseFloat(balance.toFixed(2)),
    });
  });

  return points;
};

export interface IBettingStats {
  totalBets: number;
  settledBets: number;
  wins: number;
  winRate: number;
  totalStaked: number;
  totalProfit: number;
  roi: number;
  avgOdds: number;
}

export const calculateBettingStats = (bets: IBet[]): IBettingStats => {
  const settled = bets.filter((b) => b.status !== BetStatus.Pending);
  const wins = settled.filter(
    (b) => b.status === BetStatus.Win || b.status === BetStatus.CashedOut
  );
  const totalStaked = settled.reduce((sum, b) => sum + b.stake, 0);
  const totalProfit = calculateBettingProfit(settled);
  const avgOdds =
    settled.length > 0
      ? settled.reduce((sum, b) => sum + b.odds, 0) / settled.length
      : 0;

  return {
    totalBets: bets.length,
    settledBets: settled.length,
    wins: wins.length,
    winRate: settled.length > 0 ? (wins.length / settled.length) * 100 : 0,
    totalStaked,
    totalProfit,
    roi: totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0,
    avgOdds: parseFloat(avgOdds.toFixed(2)),
  };
};
