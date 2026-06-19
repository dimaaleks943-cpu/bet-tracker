export enum BetStatus {
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
}

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
}
