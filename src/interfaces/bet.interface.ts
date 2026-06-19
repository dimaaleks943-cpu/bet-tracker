export enum BetStatus {
  Pending = "pending",
  Win = "win",
  Lose = "lose",
  Return = "return",
  CashedOut = "cashed_out",
}

export enum BetSport {
  Football = "football",
  Esports = "esports",
  Hockey = "hockey",
}

export enum BetType {
  Single = "single",
}

export enum Currency {
  BYN = "BYN",
}

export interface IBet {
  id: number;
  match: string;
  market: string;
  status: BetStatus;
  odds: number;
  stake: number;
  payout: number;
  sport: BetSport;
  type: BetType;
  currency: Currency;
  date: string;
}

export interface ICreateBetPayload {
  match: string;
  status: BetStatus;
  market: string;
  payout: number;
  sport: BetSport;
  type: BetType;
  odds: number;
  stake: number;
  currency: Currency;
  date: string;
}

export interface IUpdateBetPayload extends ICreateBetPayload {}

export interface BetFormData {
  match: string;
  status: BetStatus;
  market: string;
  payout: number | string;
  sport: BetSport;
  type: BetType;
  odds: number | string;
  stake: number | string;
  currency: Currency;
  date: string;
}

export const betToFormData = (bet: IBet): BetFormData => ({
  match: bet.match,
  status: bet.status,
  market: bet.market,
  payout: bet.payout,
  sport: bet.sport,
  type: bet.type,
  odds: bet.odds,
  stake: bet.stake,
  currency: bet.currency,
  date: bet.date ? bet.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
});
