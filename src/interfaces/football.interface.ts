export interface IFootballTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface IFootballScore {
  winner: string | null;
  fullTime: { home: number | null; away: number | null };
}

export interface IFootballMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  homeTeam: IFootballTeam;
  awayTeam: IFootballTeam;
  score: IFootballScore;
  competition?: { name: string; code: string };
}

export interface IFootballStandingRow {
  position: number;
  team: IFootballTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface IFootballCompetition {
  id: number;
  name: string;
  code: string;
  emblem: string;
  area?: { name: string };
}

export interface IFootballMatchesResponse {
  matches: IFootballMatch[];
  competition?: IFootballCompetition;
}

export interface IFootballStandingsResponse {
  standings: Array<{
    type: string;
    table: IFootballStandingRow[];
  }>;
  competition?: IFootballCompetition;
}

export interface IFootballCompetitionsResponse {
  competitions: IFootballCompetition[];
}
