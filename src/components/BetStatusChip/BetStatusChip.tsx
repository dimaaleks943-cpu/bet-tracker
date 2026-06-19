import { Chip } from "@mui/material";
import { BetStatus } from "../../interfaces/bet.interface";
import { BET_STATUS_LABELS } from "../../constants/messages.consts";

const STATUS_COLOR: Record<
  BetStatus,
  "success" | "error" | "warning" | "default" | "info"
> = {
  [BetStatus.Pending]: "info",
  [BetStatus.Win]: "success",
  [BetStatus.Lose]: "error",
  [BetStatus.Return]: "default",
  [BetStatus.CashedOut]: "warning",
};

export interface BetStatusChipProps {
  status: BetStatus;
}

export const BetStatusChip = ({ status }: BetStatusChipProps) => (
  <Chip
    label={BET_STATUS_LABELS[status]}
    color={STATUS_COLOR[status]}
    size="small"
    variant="outlined"
  />
);
