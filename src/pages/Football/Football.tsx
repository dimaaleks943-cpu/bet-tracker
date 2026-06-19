import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import {
  getCompetitionMatches,
  getCompetitionStandings,
  getCompetitions,
} from "../../api/football.api";
import { TabPanel } from "../../components/TabPanel/TabPanel";
import { FOOTBALL_DATA_API_KEY } from "../../constants/api.consts";
import { MESSAGES } from "../../constants/messages.consts";
import {
  IFootballCompetition,
  IFootballMatch,
  IFootballStandingRow,
} from "../../interfaces/football.interface";

enum FootballTab {
  Matches = 0,
  Standings = 1,
}

const FOOTBALL_LABELS = {
  TITLE: "Футбольная статистика",
  SOURCE: "Данные: football-data.org",
  COMPETITION: "Турнир",
  MATCHES: "Матчи",
  STANDINGS: "Таблица",
  COL_DATE: "Дата",
  COL_HOME: "Хозяева",
  COL_SCORE: "Счёт",
  COL_AWAY: "Гости",
  COL_STATUS: "Статус",
  COL_POS: "#",
  COL_TEAM: "Команда",
  COL_PLAYED: "И",
  COL_WDL: "В-Н-П",
  COL_GD: "РМ",
  COL_POINTS: "О",
  NO_MATCHES: "Матчи не найдены",
  NO_STANDINGS: "Таблица недоступна",
  LOADING: "Загрузка...",
} as const;

const formatMatchDate = (utcDate: string) => {
  try {
    return new Date(utcDate).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return utcDate;
  }
};

const formatScore = (match: IFootballMatch) => {
  const home = match.score.fullTime.home;
  const away = match.score.fullTime.away;
  if (home === null || away === null) {
    return "— : —";
  }
  return `${home} : ${away}`;
};

export const Football = () => {
  const [tab, setTab] = useState(FootballTab.Matches);
  const [competitions, setCompetitions] = useState<IFootballCompetition[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [matches, setMatches] = useState<IFootballMatch[]>([]);
  const [standings, setStandings] = useState<IFootballStandingRow[]>([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasApiKey = Boolean(FOOTBALL_DATA_API_KEY);

  const fetchCompetitions = useCallback(async () => {
    if (!hasApiKey) {
      setError(MESSAGES.FOOTBALL_API_KEY_MISSING);
      return;
    }
    setIsLoadingCompetitions(true);
    setError(null);
    try {
      const data = await getCompetitions();
      const sorted = [...data.competitions].sort((a, b) => a.name.localeCompare(b.name));
      setCompetitions(sorted);
      if (sorted.length > 0) {
        setSelectedCode((prev) => prev || sorted[0].code);
      }
    } catch (err) {
      console.error(MESSAGES.FOOTBALL_FETCH_ERROR, err);
      setError(MESSAGES.FOOTBALL_FETCH_ERROR);
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [hasApiKey]);

  const fetchCompetitionData = useCallback(async (code: string) => {
    if (!code || !hasApiKey) {
      return;
    }
    setIsLoadingData(true);
    setError(null);
    try {
      const [matchesData, standingsData] = await Promise.all([
        getCompetitionMatches(code),
        getCompetitionStandings(code),
      ]);
      setMatches(
        [...matchesData.matches].sort(
          (a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
        )
      );
      const totalTable = standingsData.standings.find((s) => s.type === "TOTAL");
      setStandings(totalTable?.table ?? []);
    } catch (err) {
      console.error(MESSAGES.FOOTBALL_FETCH_ERROR, err);
      setError(MESSAGES.FOOTBALL_FETCH_ERROR);
    } finally {
      setIsLoadingData(false);
    }
  }, [hasApiKey]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  useEffect(() => {
    if (selectedCode) {
      fetchCompetitionData(selectedCode);
    }
  }, [selectedCode, fetchCompetitionData]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {FOOTBALL_LABELS.TITLE}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {FOOTBALL_LABELS.SOURCE}
      </Typography>

      {error && (
        <Paper sx={{ p: 2, mb: 3, border: 1, borderColor: "error.main" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {hasApiKey && (
        <>
          <FormControl size="small" sx={{ minWidth: 280, mb: 3 }}>
            <InputLabel>{FOOTBALL_LABELS.COMPETITION}</InputLabel>
            <Select
              value={selectedCode}
              label={FOOTBALL_LABELS.COMPETITION}
              onChange={(e: SelectChangeEvent) => setSelectedCode(e.target.value)}
              disabled={isLoadingCompetitions}
            >
              {competitions.map((comp) => (
                <MenuItem key={comp.code} value={comp.code}>
                  {comp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label={FOOTBALL_LABELS.MATCHES} />
            <Tab label={FOOTBALL_LABELS.STANDINGS} />
          </Tabs>

          {isLoadingData ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TabPanel value={tab} index={FootballTab.Matches}>
                {matches.length === 0 ? (
                  <Typography color="text.secondary">{FOOTBALL_LABELS.NO_MATCHES}</Typography>
                ) : (
                  <TableContainer component={Paper} sx={{ border: 1, borderColor: "custom.border" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{FOOTBALL_LABELS.COL_DATE}</TableCell>
                          <TableCell>{FOOTBALL_LABELS.COL_HOME}</TableCell>
                          <TableCell align="center">{FOOTBALL_LABELS.COL_SCORE}</TableCell>
                          <TableCell>{FOOTBALL_LABELS.COL_AWAY}</TableCell>
                          <TableCell>{FOOTBALL_LABELS.COL_STATUS}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {matches.map((match) => (
                          <TableRow key={match.id} hover>
                            <TableCell>{formatMatchDate(match.utcDate)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={match.homeTeam.crest} sx={{ width: 24, height: 24 }} />
                                {match.homeTeam.shortName}
                              </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                              {formatScore(match)}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={match.awayTeam.crest} sx={{ width: 24, height: 24 }} />
                                {match.awayTeam.shortName}
                              </Box>
                            </TableCell>
                            <TableCell>{match.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              <TabPanel value={tab} index={FootballTab.Standings}>
                {standings.length === 0 ? (
                  <Typography color="text.secondary">{FOOTBALL_LABELS.NO_STANDINGS}</Typography>
                ) : (
                  <TableContainer component={Paper} sx={{ border: 1, borderColor: "custom.border" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{FOOTBALL_LABELS.COL_POS}</TableCell>
                          <TableCell>{FOOTBALL_LABELS.COL_TEAM}</TableCell>
                          <TableCell align="center">{FOOTBALL_LABELS.COL_PLAYED}</TableCell>
                          <TableCell align="center">{FOOTBALL_LABELS.COL_WDL}</TableCell>
                          <TableCell align="center">{FOOTBALL_LABELS.COL_GD}</TableCell>
                          <TableCell align="center">{FOOTBALL_LABELS.COL_POINTS}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {standings.map((row) => (
                          <TableRow key={row.team.id} hover>
                            <TableCell>{row.position}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={row.team.crest} sx={{ width: 24, height: 24 }} />
                                {row.team.name}
                              </Box>
                            </TableCell>
                            <TableCell align="center">{row.playedGames}</TableCell>
                            <TableCell align="center">
                              {row.won}-{row.draw}-{row.lost}
                            </TableCell>
                            <TableCell align="center">{row.goalDifference}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>
                              {row.points}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
            </>
          )}
        </>
      )}
    </Box>
  );
};
