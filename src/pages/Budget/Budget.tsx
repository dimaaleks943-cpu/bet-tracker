import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  createTransaction,
  deleteTransaction,
  getBalanceSummary,
  getTransactions,
} from "../../api/budget.api";
import { StatCard } from "../../components/StatCard/StatCard";
import { MESSAGES, TRANSACTION_TYPE_LABELS } from "../../constants/messages.consts";
import { Currency } from "../../interfaces/bet.interface";
import {
  IBalanceSummary,
  ITransaction,
  TransactionType,
} from "../../interfaces/budget.interface";

const BUDGET_LABELS = {
  TITLE: "Бюджет",
  CURRENT_BALANCE: "Текущий баланс",
  INITIAL: "Стартовый баланс",
  DEPOSITS: "Пополнения",
  WITHDRAWALS: "Снятия",
  BETTING_PROFIT: "Прибыль со ставок",
  ADD_OPERATION: "Добавить операцию",
  TYPE: "Тип операции",
  AMOUNT: "Сумма",
  DATE: "Дата",
  COMMENT: "Комментарий",
  SUBMIT: "Добавить",
  HISTORY: "История операций",
  EMPTY: "Операций пока нет",
  COL_DATE: "Дата",
  COL_TYPE: "Тип",
  COL_AMOUNT: "Сумма",
  COL_COMMENT: "Комментарий",
  COL_ACTIONS: "Действия",
  DELETE: "Удалить",
} as const;

const DEFAULT_FORM = {
  type: TransactionType.Deposit,
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  comment: "",
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  } catch {
    return dateStr;
  }
};

export const Budget = () => {
  const [summary, setSummary] = useState<IBalanceSummary | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryData, txData] = await Promise.all([
        getBalanceSummary(),
        getTransactions(),
      ]);
      setSummary(summaryData);
      setTransactions(
        txData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    } catch (error) {
      console.error(MESSAGES.BUDGET_FETCH_ERROR, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTransaction({
        type: form.type,
        amount: parseFloat(form.amount),
        currency: Currency.BYN,
        date: new Date(form.date).toISOString(),
        comment: form.comment || undefined,
      });
      alert(MESSAGES.TRANSACTION_CREATED);
      setForm(DEFAULT_FORM);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(MESSAGES.TRANSACTION_CREATE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tx: ITransaction) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) {
      return;
    }
    try {
      await deleteTransaction(tx.id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(MESSAGES.TRANSACTION_DELETE_ERROR);
    }
  };

  const currency = summary?.currency ?? Currency.BYN;
  const balanceColor = (summary?.currentBalance ?? 0) >= 0 ? "success" : "error";

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {BUDGET_LABELS.TITLE}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
            <StatCard
              label={BUDGET_LABELS.CURRENT_BALANCE}
              value={`${(summary?.currentBalance ?? 0).toFixed(2)} ${currency}`}
              color={balanceColor}
            />
            <StatCard
              label={BUDGET_LABELS.INITIAL}
              value={`${(summary?.initialBalance ?? 0).toFixed(2)} ${currency}`}
            />
            <StatCard
              label={BUDGET_LABELS.DEPOSITS}
              value={`${(summary?.totalDeposits ?? 0).toFixed(2)} ${currency}`}
            />
            <StatCard
              label={BUDGET_LABELS.WITHDRAWALS}
              value={`${(summary?.totalWithdrawals ?? 0).toFixed(2)} ${currency}`}
            />
            <StatCard
              label={BUDGET_LABELS.BETTING_PROFIT}
              value={`${(summary?.bettingProfit ?? 0) >= 0 ? "+" : ""}${(summary?.bettingProfit ?? 0).toFixed(2)} ${currency}`}
              color={(summary?.bettingProfit ?? 0) >= 0 ? "success" : "error"}
            />
          </Stack>

          <Paper
            sx={{ p: 3, mb: 4, border: 1, borderColor: "custom.border", maxWidth: 480 }}
          >
            <Typography variant="h6" gutterBottom>
              {BUDGET_LABELS.ADD_OPERATION}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>{BUDGET_LABELS.TYPE}</InputLabel>
                  <Select
                    value={form.type}
                    label={BUDGET_LABELS.TYPE}
                    onChange={(e: SelectChangeEvent) =>
                      setForm((prev) => ({
                        ...prev,
                        type: e.target.value as TransactionType,
                      }))
                    }
                  >
                    {Object.values(TransactionType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {TRANSACTION_TYPE_LABELS[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label={BUDGET_LABELS.AMOUNT}
                  type="number"
                  inputProps={{ step: "0.01", min: 0 }}
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  label={BUDGET_LABELS.DATE}
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label={BUDGET_LABELS.COMMENT}
                  value={form.comment}
                  onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                  fullWidth
                />
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {BUDGET_LABELS.SUBMIT}
                </Button>
              </Stack>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            {BUDGET_LABELS.HISTORY}
          </Typography>
          {transactions.length === 0 ? (
            <Typography color="text.secondary">{BUDGET_LABELS.EMPTY}</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ border: 1, borderColor: "custom.border" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{BUDGET_LABELS.COL_DATE}</TableCell>
                    <TableCell>{BUDGET_LABELS.COL_TYPE}</TableCell>
                    <TableCell align="right">{BUDGET_LABELS.COL_AMOUNT}</TableCell>
                    <TableCell>{BUDGET_LABELS.COL_COMMENT}</TableCell>
                    <TableCell align="center">{BUDGET_LABELS.COL_ACTIONS}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} hover>
                      <TableCell>{formatDate(tx.date)}</TableCell>
                      <TableCell>{TRANSACTION_TYPE_LABELS[tx.type]}</TableCell>
                      <TableCell align="right">
                        {tx.type === TransactionType.Withdrawal ? "−" : "+"}
                        {tx.amount} {tx.currency}
                      </TableCell>
                      <TableCell>{tx.comment ?? "—"}</TableCell>
                      <TableCell align="center">
                        <Button size="small" color="error" onClick={() => handleDelete(tx)}>
                          {BUDGET_LABELS.DELETE}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};
