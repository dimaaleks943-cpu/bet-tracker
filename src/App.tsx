import "./App.css";
import { Box } from "@mui/material";
import { Header } from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import { Statistics } from "./pages/Statistics/Statistics";
import { Bets } from "./pages/Bets/Bets";
import { Budget } from "./pages/Budget/Budget";
import { Football } from "./pages/Football/Football";
import { ROUTES } from "./constants/routes.consts";

const HEADER_OFFSET_PT = "110px";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box component="main" sx={{ pt: HEADER_OFFSET_PT, px: 2, pb: 4, maxWidth: 1400, mx: "auto" }}>
        <Routes>
          <Route path={ROUTES.BETS} element={<Bets />} />
          <Route path={ROUTES.STATISTICS} element={<Statistics />} />
          <Route path={ROUTES.BUDGET} element={<Budget />} />
          <Route path={ROUTES.FOOTBALL} element={<Football />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
