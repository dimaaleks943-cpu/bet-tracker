import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { NavLink } from "react-router";
import { ROUTES } from "../../constants/routes.consts";
import { useThemeMode } from "../../hooks/useThemeMode";
import { ThemeMode } from "../../interfaces/theme.interface";

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
        BET - Track
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
        <Box sx={{ display: "flex", gap: "12px" }}>
          <NavLink title="main" to={ROUTES.MAIN}>
            Главная
          </NavLink>
          <NavLink title="statistics" to={ROUTES.STATISTICS}>
            Статистика
          </NavLink>
          <NavLink title="add" to={ROUTES.ADD}>
            Добавить
          </NavLink>
        </Box>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleThemeChange}
          size="small"
          aria-label="переключатель темы"
        >
          <ToggleButton value="light" aria-label="светлая тема">
            Светлая
          </ToggleButton>
          <ToggleButton value="dark" aria-label="тёмная тема">
            Тёмная
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
