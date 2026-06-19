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
import {
  BetFormData,
  BetSport,
  BetStatus,
  BetType,
  Currency,
} from "../../interfaces/bet.interface";
import { MESSAGES } from "../../constants/messages.consts";

enum BetFormField {
  Match = "match",
  Market = "market",
  Status = "status",
  Odds = "odds",
  Stake = "stake",
  Payout = "payout",
  Sport = "sport",
  Type = "type",
  Currency = "currency",
}

const DECIMAL_STEP = "0.01";

const PAYOUT_CALCULATION_FIELDS = [BetFormField.Stake, BetFormField.Odds] as const;

const BET_STATUS_OPTIONS = [
  { value: BetStatus.Win, label: BetStatus.Win },
  { value: BetStatus.Lose, label: BetStatus.Lose },
  { value: BetStatus.Return, label: BetStatus.Return },
  { value: BetStatus.CashedOut, label: BetStatus.CashedOut },
] as const;

const BET_SPORT_OPTIONS = [
  { value: BetSport.Football, label: BetSport.Football },
  { value: BetSport.Esports, label: BetSport.Esports },
  { value: BetSport.Hockey, label: BetSport.Hockey },
] as const;

const ADD_VALUE_LABELS = {
  TITLE: "Добавить ставку",
  MATCH: "Матч",
  MARKET: "Рынок (например: Winner: P1)",
  STATUS: "Статус",
  ODDS: "Коэффициент (odds)",
  STAKE: "Ставка (stake)",
  PAYOUT: "Выплата (payout)",
  SPORT: "Спорт",
  SUBMIT: "Добавить ставку",
} as const;

const DEFAULT_BET_FORM_DATA: BetFormData = {
  match: "",
  status: BetStatus.Win,
  market: "",
  payout: "",
  sport: BetSport.Football,
  type: BetType.Single,
  odds: "",
  stake: "",
  currency: Currency.BYN,
};

export const AddValue = () => {
  const [formData, setFormData] = useState<BetFormData>(DEFAULT_BET_FORM_DATA);

  const updateFormData = (name: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        PAYOUT_CALCULATION_FIELDS.includes(name as (typeof PAYOUT_CALCULATION_FIELDS)[number])
      ) {
        const stake = parseFloat(
          name === BetFormField.Stake ? value : (updated.stake as string)
        );
        const odds = parseFloat(
          name === BetFormField.Odds ? value : (updated.odds as string)
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
      alert(MESSAGES.BET_CREATED(res.id));

      setFormData(DEFAULT_BET_FORM_DATA);
    } catch (error) {
      console.error(error);
      alert(MESSAGES.BET_CREATE_ERROR);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "custom.border",
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {ADD_VALUE_LABELS.TITLE}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label={ADD_VALUE_LABELS.MATCH}
            name={BetFormField.Match}
            value={formData.match}
            onChange={handleInputChange}
            required
            fullWidth
          />

          <TextField
            label={ADD_VALUE_LABELS.MARKET}
            name={BetFormField.Market}
            value={formData.market}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>{ADD_VALUE_LABELS.STATUS}</InputLabel>
            <Select
              name={BetFormField.Status}
              value={formData.status}
              label={ADD_VALUE_LABELS.STATUS}
              onChange={handleSelectChange}
            >
              {BET_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={ADD_VALUE_LABELS.ODDS}
            name={BetFormField.Odds}
            type="number"
            inputProps={{ step: DECIMAL_STEP }}
            value={formData.odds}
            onChange={handleInputChange}
            required
          />

          <TextField
            label={ADD_VALUE_LABELS.STAKE}
            name={BetFormField.Stake}
            type="number"
            inputProps={{ step: DECIMAL_STEP }}
            value={formData.stake}
            onChange={handleInputChange}
            required
          />

          <TextField
            label={ADD_VALUE_LABELS.PAYOUT}
            name={BetFormField.Payout}
            type="number"
            inputProps={{ step: DECIMAL_STEP }}
            value={formData.payout}
            onChange={handleInputChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel>{ADD_VALUE_LABELS.SPORT}</InputLabel>
            <Select
              name={BetFormField.Sport}
              value={formData.sport}
              label={ADD_VALUE_LABELS.SPORT}
              onChange={handleSelectChange}
            >
              {BET_SPORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 2, mt: 1 }}
          >
            {ADD_VALUE_LABELS.SUBMIT}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};
