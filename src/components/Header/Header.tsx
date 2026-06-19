import { Box, IconButton, Typography } from "@mui/material";
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
  TO_DARK_TITLE: "Тёмная тема",
  TO_LIGHT_TITLE: "Светлая тема",
} as const;

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
    />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 14.5A8.5 8.5 0 1 1 9.5 3 6.5 6.5 0 0 0 21 14.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const Header = () => {
  const { mode, toggleTheme } = useThemeMode();
  const isLight = mode === ThemeMode.Light;

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
      <IconButton
        onClick={toggleTheme}
        aria-label={THEME_TOGGLE.ARIA_LABEL}
        title={isLight ? THEME_TOGGLE.TO_DARK_TITLE : THEME_TOGGLE.TO_LIGHT_TITLE}
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          right: 16,
          color: "text.secondary",
          bgcolor: "custom.backgroundTertiary",
          "&:hover": {
            bgcolor: "custom.primarySoft",
            color: "primary.main",
          },
        }}
      >
        {isLight ? <MoonIcon /> : <SunIcon />}
      </IconButton>

      <Typography variant="h4" fontWeight={700} color="primary">
        {APP_TITLE}
      </Typography>

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
    </Box>
  );
};
