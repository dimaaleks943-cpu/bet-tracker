import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getBets } from "../../api/bets.api";
import { getTransactions } from "../../api/budget.api";
import { StatCard } from "../../components/StatCard/StatCard";
import { BET_SPORT_LABELS, BET_STATUS_LABELS, MESSAGES } from "../../constants/messages.consts";
import { BetSport, BetStatus, Currency, IBet } from "../../interfaces/bet.interface";
import { ITransaction } from "../../interfaces/budget.interface";
import {
  buildBalanceTimeline,
  calculateBettingStats,
  IBalanceTimelinePoint,
} from "../../utils/buildBalanceTimeline";

const STATISTICS_LABELS = {
  TITLE: "Статистика",
  CHART_TITLE: "Прогресс баланса",
  BALANCE: "Баланс:",
  EVENT: "Событие:",
  FILTER_SPORT: "Спорт",
  FILTER_STATUS: "Статус",
  FILTER_FROM: "С",
  FILTER_TO: "По",
  ALL: "Все",
  WIN_RATE: "Win Rate",
  ROI: "ROI",
  PROFIT: "Прибыль",
  TOTAL_BETS: "Ставок",
  AVG_ODDS: "Ср. коэф.",
  TOTAL_STAKED: "Оборот",
} as const;

const CHART_DATA_KEYS = {
  LABEL: "label",
  BALANCE: "balance",
} as const;

const CHART_CONFIG = {
  GRID_DASH: "3 3",
  LINE_TYPE: "monotone",
  DOT_RADIUS: 4,
  LINE_WIDTH: 2,
} as const;

const filterBets = (
  bets: IBet[],
  sport: BetSport | "all",
  status: BetStatus | "all",
  dateFrom: string,
  dateTo: string
): IBet[] => {
  return bets.filter((bet) => {
    const betDate = new Date(bet.date);
    const matchesSport = sport === "all" || bet.sport === sport;
    const matchesStatus = status === "all" || bet.status === status;
    const matchesFrom = !dateFrom || betDate >= new Date(dateFrom);
    const matchesTo = !dateTo || betDate <= new Date(dateTo + "T23:59:59");
    return matchesSport && matchesStatus && matchesFrom && matchesTo;
  });
};

export const Statistics = () => {
  const theme = useTheme();
  const [bets, setBets] = useState<IBet[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState<BetSport | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BetStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [betsData, txData] = await Promise.all([getBets(), getTransactions()]);
      setBets(betsData);
      setTransactions(txData);
    } catch (error) {
      console.error(MESSAGES.BETS_FETCH_ERROR, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredBets = useMemo(
    () => filterBets(bets, sportFilter, statusFilter, dateFrom, dateTo),
    [bets, sportFilter, statusFilter, dateFrom, dateTo]
  );

  const chartData: IBalanceTimelinePoint[] = useMemo(() => {
    const filteredTx = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const matchesFrom = !dateFrom || txDate >= new Date(dateFrom);
      const matchesTo = !dateTo || txDate <= new Date(dateTo + "T23:59:59");
      return matchesFrom && matchesTo;
    });
    return buildBalanceTimeline(filteredBets, filteredTx);
  }, [filteredBets, transactions, dateFrom, dateTo]);

  const stats = useMemo(() => calculateBettingStats(filteredBets), [filteredBets]);

  const profitColor = stats.totalProfit >= 0 ? "success" : "error";

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {STATISTICS_LABELS.TITLE}
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{STATISTICS_LABELS.FILTER_SPORT}</InputLabel>
          <Select
            value={sportFilter}
            label={STATISTICS_LABELS.FILTER_SPORT}
            onChange={(e: SelectChangeEvent) =>
              setSportFilter(e.target.value as BetSport | "all")
            }
          >
            <MenuItem value="all">{STATISTICS_LABELS.ALL}</MenuItem>
            {Object.values(BetSport).map((sport) => (
              <MenuItem key={sport} value={sport}>
                {BET_SPORT_LABELS[sport]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{STATISTICS_LABELS.FILTER_STATUS}</InputLabel>
          <Select
            value={statusFilter}
            label={STATISTICS_LABELS.FILTER_STATUS}
            onChange={(e: SelectChangeEvent) =>
              setStatusFilter(e.target.value as BetStatus | "all")
            }
          >
            <MenuItem value="all">{STATISTICS_LABELS.ALL}</MenuItem>
            {Object.values(BetStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {BET_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label={STATISTICS_LABELS.FILTER_FROM}
          type="date"
          size="small"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={STATISTICS_LABELS.FILTER_TO}
          type="date"
          size="small"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
        <StatCard label={STATISTICS_LABELS.WIN_RATE} value={`${stats.winRate.toFixed(1)}%`} />
        <StatCard
          label={STATISTICS_LABELS.ROI}
          value={`${stats.roi.toFixed(1)}%`}
          color={profitColor}
        />
        <StatCard
          label={STATISTICS_LABELS.PROFIT}
          value={`${stats.totalProfit >= 0 ? "+" : ""}${stats.totalProfit.toFixed(2)} ${Currency.BYN}`}
          color={profitColor}
        />
        <StatCard label={STATISTICS_LABELS.TOTAL_BETS} value={String(stats.settledBets)} />
        <StatCard label={STATISTICS_LABELS.AVG_ODDS} value={String(stats.avgOdds)} />
        <StatCard
          label={STATISTICS_LABELS.TOTAL_STAKED}
          value={`${stats.totalStaked.toFixed(2)} ${Currency.BYN}`}
        />
      </Stack>

      <Typography variant="h6" gutterBottom>
        {STATISTICS_LABELS.CHART_TITLE}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : chartData.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          Нет данных для отображения. Добавьте ставки или операции бюджета.
        </Typography>
      ) : (
        <Box sx={{ width: "100%", height: 500 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray={CHART_CONFIG.GRID_DASH}
                stroke={theme.palette.custom.chartGrid}
              />
              <XAxis
                dataKey={CHART_DATA_KEYS.LABEL}
                stroke={theme.palette.text.secondary}
              />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const point = payload[0].payload as IBalanceTimelinePoint;
                    return (
                      <Box
                        sx={{
                          bgcolor: "custom.chartTooltip",
                          border: 1,
                          borderColor: "custom.border",
                          p: 1.5,
                          borderRadius: 2,
                          lineHeight: 1.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {label}
                        </Typography>
                        <Typography variant="body2">
                          {STATISTICS_LABELS.BALANCE} {point.balance} {Currency.BYN}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {STATISTICS_LABELS.EVENT} {point.description}
                        </Typography>
                        {point.detail && (
                          <Typography variant="body2">{point.detail}</Typography>
                        )}
                      </Box>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type={CHART_CONFIG.LINE_TYPE}
                dataKey={CHART_DATA_KEYS.BALANCE}
                stroke={theme.palette.custom.chartLine}
                strokeWidth={CHART_CONFIG.LINE_WIDTH}
                dot={{ r: CHART_CONFIG.DOT_RADIUS }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};
