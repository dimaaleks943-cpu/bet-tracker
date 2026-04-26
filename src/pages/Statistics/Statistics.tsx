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
import axios from "axios";

interface IBet {
  currency: string;
  date: string;
  id: number;
  market: string;
  match: string;
  odds: number;
  payout: number;
  sport: "esports" | "footbal" | "hockey";
  stake: number;
  status: "win" | "loser" | "return";
  type: string;
}

export const Statistics = () => {
  const [bets, setBets] = useState<IBet[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const generateChartData = (bets: IBet[]) => {
    let balance = 0; // 192... стартовый баланс
    const data = bets.map((bet) => {
      let profit = 0;

      if (bet.status === "win" || bet.status === "cashed_out") {
        profit = bet.payout - bet.stake;
      } else if (bet.status === "lose") {
        profit = -bet.stake;
      } else if (bet.status === "return") {
        profit = 0;
      }

      balance += profit;

      return {
        name: `#${bet.id}`,
        balance: parseFloat(balance.toFixed(2)),
        event: bet.match,
        market: bet.market,
        stake: bet.stake,
      };
    });

    setChartData(data);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/bets/")
      .then((response) => {
        setBets(response.data);
        generateChartData(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }, []);

  return (
    <div style={{ width: "90%", height: 800, margin: "auto", marginTop: 50}}>
      <h2>Прогресс баланса</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          {/* === Кастомный Tooltip с балансом и событием === */}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const bet = payload[0].payload;
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
                    <p style={{ margin: 0 }}> {bet.market} {bet.stake } BYN</p>
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
