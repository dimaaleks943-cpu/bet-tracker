import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../../constants/routes.consts";
import { ThemeMode } from "../../interfaces/theme.interface";
import { useThemeMode } from "../../hooks/useThemeMode";

const APP_TITLE = "BET - Track";

const NAV_ITEMS = [
  { path: ROUTES.BETS, label: ROUTE_LABELS[ROUTES.BETS] },
  { path: ROUTES.STATISTICS, label: ROUTE_LABELS[ROUTES.STATISTICS] },
  { path: ROUTES.BUDGET, label: ROUTE_LABELS[ROUTES.BUDGET] },
  { path: ROUTES.FOOTBALL, label: ROUTE_LABELS[ROUTES.FOOTBALL] },
] as const;

const THEME_TOGGLE = {
  ARIA_LABEL: "переключатель темы",
  LIGHT_LABEL: "Светлая",
  LIGHT_ARIA: "светлая тема",
  DARK_LABEL: "Тёмная",
  DARK_ARIA: "тёмная тема",
} as const;

export const Header = () => {
  const { mode, setMode } = useThemeMode();

  const handleThemeChange = (_: React.MouseEvent<HTMLElement>, value: ThemeMode | null) => {
    if (value) {
      setMode(value);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        padding: "12px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "custom.border",
      }}
    >
      <Typography variant="h4" fontWeight={700} color="primary">
        {APP_TITLE}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                padding: "6px 14px",
                borderRadius: 8,
                fontWeight: isActive ? 700 : 400,
                backgroundColor: isActive ? "rgba(51, 144, 236, 0.12)" : "transparent",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </Box>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleThemeChange}
          size="small"
          aria-label={THEME_TOGGLE.ARIA_LABEL}
        >
          <ToggleButton value={ThemeMode.Light} aria-label={THEME_TOGGLE.LIGHT_ARIA}>
            {THEME_TOGGLE.LIGHT_LABEL}
          </ToggleButton>
          <ToggleButton value={ThemeMode.Dark} aria-label={THEME_TOGGLE.DARK_ARIA}>
            {THEME_TOGGLE.DARK_LABEL}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
