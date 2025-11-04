import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";

interface BetFormData {
  match: string;
  status: "win" | "lose" | "return" | "cashed_out";
  market: string;
  payout: number | string;
  sport: "football" | "esports" | "hockey";
  type: string;
  odds: number | string;
  stake: number | string;
  currency: string;
}

const AddBetForm = () => {
  const [formData, setFormData] = useState<BetFormData>({
    match: "",
    status: "win",
    market: "",
    payout: "",
    sport: "football",
    type: "single",
    odds: "",
    stake: "",
    currency: "BYN",
  });

  // Обработка изменений в инпутах
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name as string]: value };

      // Автоматический расчет payout (если есть ставка и коэффициент)
      if (name === "stake" || name === "odds") {
        const stake = parseFloat(
          name === "stake" ? (value as string) : (updated.stake as string)
        );
        const odds = parseFloat(
          name === "odds" ? (value as string) : (updated.odds as string)
        );
        if (!isNaN(stake) && !isNaN(odds)) {
          updated.payout = (stake * odds).toFixed(2);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        payout: parseFloat(formData.payout as string),
        odds: parseFloat(formData.odds as string),
        stake: parseFloat(formData.stake as string),
      };

      const res = await axios.post("http://127.0.0.1:8000/bets/", payload);
      alert(`✅ Запись добавлена! ID: ${res.data.id}`);

      setFormData({
        match: "",
        status: "win",
        market: "",
        payout: "",
        sport: "football",
        type: "single",
        odds: "",
        stake: "",
        currency: "BYN",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Ошибка при добавлении записи");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: 8,
        p: 4,
        borderRadius: 3,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Добавить ставку
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Матч"
            name="match"
            value={formData.match}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Рынок (например: Winner: P1)"
            name="market"
            value={formData.market}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Статус"
              onChange={handleChange}
            >
              <MenuItem value="win">win</MenuItem>
              <MenuItem value="lose">lose</MenuItem>
              <MenuItem value="return">return</MenuItem>
              <MenuItem value="cashed_out">cashed_out</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Коэффициент (odds)"
            name="odds"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.odds}
            onChange={handleChange}
            required
          />

          <TextField
            label="Ставка (stake)"
            name="stake"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.stake}
            onChange={handleChange}
            required
          />

          <TextField
            label="Выплата (payout)"
            name="payout"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.payout}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Спорт</InputLabel>
            <Select
              name="sport"
              value={formData.sport}
              label="Спорт"
              onChange={handleChange}
            >
              <MenuItem value="football">football</MenuItem>
              <MenuItem value="esports">esports</MenuItem>
              <MenuItem value="hockey">hockey</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 2, mt: 1 }}
          >
            Добавить ставку
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AddBetForm;
