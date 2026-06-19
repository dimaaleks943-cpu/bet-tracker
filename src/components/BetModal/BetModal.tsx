import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { IBet } from "../../interfaces/bet.interface";
import { BetForm } from "../BetForm/BetForm";

const BET_MODAL_LABELS = {
  CREATE_TITLE: "Добавить ставку",
  EDIT_TITLE: "Редактировать ставку",
  CLOSE_ARIA: "закрыть",
} as const;

export interface BetModalProps {
  open: boolean;
  onClose: () => void;
  bet?: IBet;
  onSuccess: () => void;
}

export const BetModal = ({ open, onClose, bet, onSuccess }: BetModalProps) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {bet ? BET_MODAL_LABELS.EDIT_TITLE : BET_MODAL_LABELS.CREATE_TITLE}
        <IconButton onClick={onClose} aria-label={BET_MODAL_LABELS.CLOSE_ARIA} size="small">
          <Typography component="span" fontSize={20} lineHeight={1}>
            ×
          </Typography>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <BetForm bet={bet} onSuccess={handleSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
