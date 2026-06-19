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
import { getBets } from "../../api/bets.api";
import { IChartDataPoint } from "./statistics.interface";
import { generateChartData } from "./generateChartData";

export const Statistics = () => {
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
    <div style={{ width: "90%", height: 800, margin: "auto", marginTop: 50 }}>
      <h2>Прогресс баланса</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const bet = payload[0].payload as IChartDataPoint;
                return (
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      padding: "8px",
                      borderRadius: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
                    <p style={{ margin: 0 }}>💰 Баланс: {bet.balance} $</p>
                    <p style={{ margin: 0, color: "#555" }}>
                      ⚽ Событие: {bet.event}
                    </p>
                    <p style={{ margin: 0 }}>
                      {bet.market} {bet.stake} BYN
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
