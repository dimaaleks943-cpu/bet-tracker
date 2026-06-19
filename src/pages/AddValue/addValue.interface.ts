import { BetSport, BetStatus } from "../../interfaces/bet.interface";

export interface BetFormData {
  match: string;
  status: BetStatus;
  market: string;
  payout: number | string;
  sport: BetSport;
  type: string;
  odds: number | string;
  stake: number | string;
  currency: string;
}
