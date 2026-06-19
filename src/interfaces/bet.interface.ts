export type BetStatus = "win" | "lose" | "return" | "cashed_out";
export type BetSport = "football" | "esports" | "hockey";

export interface IBet {
  id: number;
  match: string;
  market: string;
  status: BetStatus;
  odds: number;
  stake: number;
  payout: number;
  sport: BetSport;
  type: string;
  currency: string;
  date: string;
}

export interface ICreateBetPayload {
  match: string;
  status: BetStatus;
  market: string;
  payout: number;
  sport: BetSport;
  type: string;
  odds: number;
  stake: number;
  currency: string;
}
