import {Box, Typography} from "@mui/material";
import { NavLink } from "react-router";

export const Header = () => {
    return (
        <Box
        sx={{
            padding: "0 22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position:"fixed",
            top: 0,
            width: "100%",
        }}
        >
            <Typography variant="h2">
                BET - Track
            </Typography>

            <Box
            sx={{
                display:"flex",
                gap: "12px",
            }}
            >
                <NavLink title="main" to="/">Главная</NavLink>
                <NavLink title="statistics" to="/statistics">Статистика</NavLink>
                <NavLink title="add" to="/add">Добавить</NavLink>

            </Box>
        </Box>
    )
}