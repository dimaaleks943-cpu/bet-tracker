import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { getBets } from "../../api/bets.api";
import { MESSAGES } from "../../constants/messages.consts";
import { Currency } from "../../interfaces/bet.interface";
import { generateChartData, IChartDataPoint } from "./generateChartData";

const STATISTICS_LABELS = {
  TITLE: "Прогресс баланса",
  BALANCE: "💰 Баланс:",
  EVENT: "⚽ Событие:",
} as const;

const CHART_DATA_KEYS = {
  NAME: "name",
  BALANCE: "balance",
} as const;

const CHART_CONFIG = {
  GRID_DASH: "3 3",
  LINE_TYPE: "monotone",
  DOT_RADIUS: 5,
  LINE_WIDTH: 2,
} as const;

export const Statistics = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<IChartDataPoint[]>([]);

  useEffect(() => {
    getBets()
      .then((bets) => {
        setChartData(generateChartData(bets));
      })
      .catch((error) => {
        console.error(MESSAGES.BETS_FETCH_ERROR, error);
      });
  }, []);

  return (
    <Box sx={{ width: "90%", height: 800, mx: "auto", mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {STATISTICS_LABELS.TITLE}
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray={CHART_CONFIG.GRID_DASH}
            stroke={theme.palette.custom.chartGrid}
          />
          <XAxis dataKey={CHART_DATA_KEYS.NAME} stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const bet = payload[0].payload as IChartDataPoint;
                return (
                  <Box
                    sx={{
                      bgcolor: "custom.chartTooltip",
                      border: 1,
                      borderColor: "custom.border",
                      p: 1,
                      borderRadius: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {label}
                    </Typography>
                    <Typography variant="body2">
                      {STATISTICS_LABELS.BALANCE} {bet.balance} $
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {STATISTICS_LABELS.EVENT} {bet.event}
                    </Typography>
                    <Typography variant="body2">
                      {bet.market} {bet.stake} {Currency.BYN}
                    </Typography>
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
  );
};
