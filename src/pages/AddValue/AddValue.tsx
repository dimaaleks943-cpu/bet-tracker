import { useState, ChangeEvent, FormEvent } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import { createBet } from "../../api/bets.api";
import { BetFormData } from "./addValue.interface";
import { DEFAULT_BET_FORM_DATA } from "./addValue.consts";

export const AddValue = () => {
  const [formData, setFormData] = useState<BetFormData>(DEFAULT_BET_FORM_DATA);

  const updateFormData = (name: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "stake" || name === "odds") {
        const stake = parseFloat(
          name === "stake" ? value : (updated.stake as string)
        );
        const odds = parseFloat(
          name === "odds" ? value : (updated.odds as string)
        );
        if (!isNaN(stake) && !isNaN(odds)) {
          updated.payout = (stake * odds).toFixed(2);
        }
      }
      return updated;
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    updateFormData(name, value);
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

      const res = await createBet(payload);
      alert(`✅ Запись добавлена! ID: ${res.id}`);

      setFormData(DEFAULT_BET_FORM_DATA);
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
            onChange={handleInputChange}
            required
            fullWidth
          />

          <TextField
            label="Рынок (например: Winner: P1)"
            name="market"
            value={formData.market}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Статус"
              onChange={handleSelectChange}
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
            onChange={handleInputChange}
            required
          />

          <TextField
            label="Ставка (stake)"
            name="stake"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.stake}
            onChange={handleInputChange}
            required
          />

          <TextField
            label="Выплата (payout)"
            name="payout"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.payout}
            onChange={handleInputChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Спорт</InputLabel>
            <Select
              name="sport"
              value={formData.sport}
              label="Спорт"
              onChange={handleSelectChange}
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
