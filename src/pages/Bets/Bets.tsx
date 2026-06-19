import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
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
import { deleteBet, getBets } from "../../api/bets.api";
import { BetModal } from "../../components/BetModal/BetModal";
import { BetStatusChip } from "../../components/BetStatusChip/BetStatusChip";
import {
  BET_SPORT_LABELS,
  BET_STATUS_LABELS,
  MESSAGES,
} from "../../constants/messages.consts";
import { BetSport, BetStatus, Currency, IBet } from "../../interfaces/bet.interface";
import { calculateBetProfit } from "../../utils/calculateBetProfit";

const BETS_LABELS = {
  TITLE: "Мои ставки",
  ADD: "Добавить ставку",
  EMPTY: "Ставок пока нет. Добавьте первую!",
  SEARCH: "Поиск по матчу",
  FILTER_STATUS: "Статус",
  FILTER_SPORT: "Спорт",
  ALL: "Все",
  COL_DATE: "Дата",
  COL_MATCH: "Матч",
  COL_MARKET: "Рынок",
  COL_ODDS: "Коэф.",
  COL_STAKE: "Ставка",
  COL_PAYOUT: "Выплата",
  COL_PROFIT: "P/L",
  COL_STATUS: "Статус",
  COL_SPORT: "Спорт",
  COL_ACTIONS: "Действия",
  EDIT: "Изм.",
  DELETE: "Удал.",
} as const;

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  } catch {
    return dateStr;
  }
};

const formatProfit = (profit: number) => {
  const prefix = profit > 0 ? "+" : "";
  return `${prefix}${profit.toFixed(2)}`;
};

export const Bets = () => {
  const [bets, setBets] = useState<IBet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBet, setEditingBet] = useState<IBet | undefined>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BetStatus | "all">("all");
  const [sportFilter, setSportFilter] = useState<BetSport | "all">("all");

  const fetchBets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBets();
      setBets(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error(MESSAGES.BETS_FETCH_ERROR, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  const filteredBets = useMemo(() => {
    return bets.filter((bet) => {
      const matchesSearch = bet.match.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || bet.status === statusFilter;
      const matchesSport = sportFilter === "all" || bet.sport === sportFilter;
      return matchesSearch && matchesStatus && matchesSport;
    });
  }, [bets, search, statusFilter, sportFilter]);

  const handleOpenCreate = () => {
    setEditingBet(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (bet: IBet) => {
    setEditingBet(bet);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBet(undefined);
  };

  const handleDelete = async (bet: IBet) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) {
      return;
    }
    try {
      await deleteBet(bet.id);
      alert(MESSAGES.BET_DELETED);
      fetchBets();
    } catch (error) {
      console.error(error);
      alert(MESSAGES.BET_DELETE_ERROR);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {BETS_LABELS.TITLE}
        </Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          {BETS_LABELS.ADD}
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label={BETS_LABELS.SEARCH}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{BETS_LABELS.FILTER_STATUS}</InputLabel>
          <Select
            value={statusFilter}
            label={BETS_LABELS.FILTER_STATUS}
            onChange={(e: SelectChangeEvent) =>
              setStatusFilter(e.target.value as BetStatus | "all")
            }
          >
            <MenuItem value="all">{BETS_LABELS.ALL}</MenuItem>
            {Object.values(BetStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {BET_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{BETS_LABELS.FILTER_SPORT}</InputLabel>
          <Select
            value={sportFilter}
            label={BETS_LABELS.FILTER_SPORT}
            onChange={(e: SelectChangeEvent) =>
              setSportFilter(e.target.value as BetSport | "all")
            }
          >
            <MenuItem value="all">{BETS_LABELS.ALL}</MenuItem>
            {Object.values(BetSport).map((sport) => (
              <MenuItem key={sport} value={sport}>
                {BET_SPORT_LABELS[sport]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredBets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", border: 1, borderColor: "custom.border" }}>
          <Typography color="text.secondary">{BETS_LABELS.EMPTY}</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ border: 1, borderColor: "custom.border" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{BETS_LABELS.COL_DATE}</TableCell>
                <TableCell>{BETS_LABELS.COL_MATCH}</TableCell>
                <TableCell>{BETS_LABELS.COL_MARKET}</TableCell>
                <TableCell align="right">{BETS_LABELS.COL_ODDS}</TableCell>
                <TableCell align="right">{BETS_LABELS.COL_STAKE}</TableCell>
                <TableCell align="right">{BETS_LABELS.COL_PAYOUT}</TableCell>
                <TableCell align="right">{BETS_LABELS.COL_PROFIT}</TableCell>
                <TableCell>{BETS_LABELS.COL_STATUS}</TableCell>
                <TableCell>{BETS_LABELS.COL_SPORT}</TableCell>
                <TableCell align="center">{BETS_LABELS.COL_ACTIONS}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBets.map((bet) => {
                const profit = calculateBetProfit(bet);
                return (
                  <TableRow key={bet.id} hover>
                    <TableCell>{formatDate(bet.date)}</TableCell>
                    <TableCell>{bet.match}</TableCell>
                    <TableCell>{bet.market}</TableCell>
                    <TableCell align="right">{bet.odds}</TableCell>
                    <TableCell align="right">
                      {bet.stake} {bet.currency}
                    </TableCell>
                    <TableCell align="right">
                      {bet.payout} {bet.currency}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          profit > 0
                            ? "success.main"
                            : profit < 0
                              ? "error.main"
                              : "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {bet.status === BetStatus.Pending
                        ? "—"
                        : `${formatProfit(profit)} ${Currency.BYN}`}
                    </TableCell>
                    <TableCell>
                      <BetStatusChip status={bet.status} />
                    </TableCell>
                    <TableCell>{BET_SPORT_LABELS[bet.sport]}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(bet)}
                          title={BETS_LABELS.EDIT}
                        >
                          <Typography variant="caption">{BETS_LABELS.EDIT}</Typography>
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(bet)}
                          title={BETS_LABELS.DELETE}
                        >
                          <Typography variant="caption">{BETS_LABELS.DELETE}</Typography>
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <BetModal
        open={modalOpen}
        onClose={handleCloseModal}
        bet={editingBet}
        onSuccess={fetchBets}
      />
    </Box>
  );
};
