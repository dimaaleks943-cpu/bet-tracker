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
import { IChartDataPoint } from "./statistics.interface";
import { generateChartData } from "./generateChartData";

export const Statistics = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<IChartDataPoint[]>([]);

  useEffect(() => {
    getBets()
      .then((bets) => {
        setChartData(generateChartData(bets));
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }, []);

  return (
    <Box sx={{ width: "90%", height: 800, mx: "auto", mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Прогресс баланса
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.custom.chartGrid} />
          <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
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
                    <Typography variant="body2">💰 Баланс: {bet.balance} $</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ⚽ Событие: {bet.event}
                    </Typography>
                    <Typography variant="body2">
                      {bet.market} {bet.stake} BYN
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={theme.palette.custom.chartLine}
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
