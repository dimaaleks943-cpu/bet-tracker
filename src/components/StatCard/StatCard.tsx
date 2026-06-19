import { Paper, Typography } from "@mui/material";

export interface StatCardProps {
  label: string;
  value: string;
  color?: "primary" | "success" | "error" | "text.primary";
}

export const StatCard = ({ label, value, color = "text.primary" }: StatCardProps) => (
  <Paper
    sx={{
      p: 2,
      border: 1,
      borderColor: "custom.border",
      bgcolor: "background.paper",
      flex: 1,
      minWidth: 140,
    }}
  >
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="h6" fontWeight={700} color={color}>
      {value}
    </Typography>
  </Paper>
);
