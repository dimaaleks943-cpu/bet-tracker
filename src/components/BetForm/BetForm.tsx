import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { createBet, updateBet } from "../../api/bets.api";
import {
  BetFormData,
  BetSport,
  BetStatus,
  BetType,
  Currency,
  betToFormData,
  IBet,
} from "../../interfaces/bet.interface";
import { MESSAGES, BET_STATUS_LABELS, BET_SPORT_LABELS } from "../../constants/messages.consts";

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
  Date = "date",
}

const DECIMAL_STEP = "0.01";

const PAYOUT_CALCULATION_FIELDS = [BetFormField.Stake, BetFormField.Odds, BetFormField.Status] as const;

const BET_STATUS_OPTIONS = [
  { value: BetStatus.Pending, label: BET_STATUS_LABELS.pending },
  { value: BetStatus.Win, label: BET_STATUS_LABELS.win },
  { value: BetStatus.Lose, label: BET_STATUS_LABELS.lose },
  { value: BetStatus.Return, label: BET_STATUS_LABELS.return },
  { value: BetStatus.CashedOut, label: BET_STATUS_LABELS.cashed_out },
] as const;

const BET_SPORT_OPTIONS = [
  { value: BetSport.Football, label: BET_SPORT_LABELS.football },
  { value: BetSport.Esports, label: BET_SPORT_LABELS.esports },
  { value: BetSport.Hockey, label: BET_SPORT_LABELS.hockey },
] as const;

const BET_FORM_LABELS = {
  MATCH: "Матч",
  MARKET: "Рынок (например: Winner: P1)",
  STATUS: "Статус",
  ODDS: "Коэффициент (odds)",
  STAKE: "Ставка (stake)",
  PAYOUT: "Выплата (payout)",
  SPORT: "Спорт",
  DATE: "Дата",
  SUBMIT_CREATE: "Добавить ставку",
  SUBMIT_UPDATE: "Сохранить",
  CANCEL: "Отмена",
} as const;

export const DEFAULT_BET_FORM_DATA: BetFormData = {
  match: "",
  status: BetStatus.Pending,
  market: "",
  payout: "",
  sport: BetSport.Football,
  type: BetType.Single,
  odds: "",
  stake: "",
  currency: Currency.BYN,
  date: new Date().toISOString().slice(0, 10),
};

const calculatePayout = (stake: number, odds: number, status: BetStatus): string => {
  if (status === BetStatus.Lose) {
    return "0";
  }
  if (status === BetStatus.Return) {
    return stake.toFixed(2);
  }
  if (!isNaN(stake) && !isNaN(odds)) {
    return (stake * odds).toFixed(2);
  }
  return "";
};

export interface BetFormProps {
  bet?: IBet;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const BetForm = ({ bet, onSuccess, onCancel }: BetFormProps) => {
  const isEdit = Boolean(bet);
  const [formData, setFormData] = useState<BetFormData>(
    bet ? betToFormData(bet) : DEFAULT_BET_FORM_DATA
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(bet ? betToFormData(bet) : DEFAULT_BET_FORM_DATA);
  }, [bet]);

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
        const status = (
          name === BetFormField.Status ? value : updated.status
        ) as BetStatus;
        updated.payout = calculatePayout(stake, odds, status);
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
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        payout: parseFloat(formData.payout as string),
        odds: parseFloat(formData.odds as string),
        stake: parseFloat(formData.stake as string),
        date: new Date(formData.date).toISOString(),
      };

      if (isEdit && bet) {
        await updateBet(bet.id, payload);
        alert(MESSAGES.BET_UPDATED(bet.id));
      } else {
        const res = await createBet(payload);
        alert(MESSAGES.BET_CREATED(res.id));
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert(isEdit ? MESSAGES.BET_UPDATE_ERROR : MESSAGES.BET_CREATE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <TextField
          label={BET_FORM_LABELS.MATCH}
          name={BetFormField.Match}
          value={formData.match}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <TextField
          label={BET_FORM_LABELS.MARKET}
          name={BetFormField.Market}
          value={formData.market}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          label={BET_FORM_LABELS.DATE}
          name={BetFormField.Date}
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth>
          <InputLabel>{BET_FORM_LABELS.STATUS}</InputLabel>
          <Select
            name={BetFormField.Status}
            value={formData.status}
            label={BET_FORM_LABELS.STATUS}
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
          label={BET_FORM_LABELS.ODDS}
          name={BetFormField.Odds}
          type="number"
          inputProps={{ step: DECIMAL_STEP, min: 1 }}
          value={formData.odds}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <TextField
          label={BET_FORM_LABELS.STAKE}
          name={BetFormField.Stake}
          type="number"
          inputProps={{ step: DECIMAL_STEP, min: 0 }}
          value={formData.stake}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <TextField
          label={BET_FORM_LABELS.PAYOUT}
          name={BetFormField.Payout}
          type="number"
          inputProps={{ step: DECIMAL_STEP, min: 0 }}
          value={formData.payout}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>{BET_FORM_LABELS.SPORT}</InputLabel>
          <Select
            name={BetFormField.Sport}
            value={formData.sport}
            label={BET_FORM_LABELS.SPORT}
            onChange={handleSelectChange}
          >
            {BET_SPORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              {BET_FORM_LABELS.CANCEL}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isEdit ? BET_FORM_LABELS.SUBMIT_UPDATE : BET_FORM_LABELS.SUBMIT_CREATE}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
