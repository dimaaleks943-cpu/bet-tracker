import "./App.css";
import { Box } from "@mui/material";
import { Header } from "./components/Header/Header";
import { Main } from "./pages/Main/Main";
import { Routes, Route } from "react-router-dom";
import { Statistics } from "./pages/Statistics/Statistics";
import { AddValue } from "./pages/AddValue/AddValue";
import { ROUTES } from "./constants/routes.consts";

const HEADER_OFFSET_PT = "110px";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box component="main" sx={{ pt: HEADER_OFFSET_PT, px: 2, pb: 4 }}>
        <Routes>
          <Route path={ROUTES.MAIN} element={<Main />} />
          <Route path={ROUTES.STATISTICS} element={<Statistics />} />
          <Route path={ROUTES.ADD} element={<AddValue />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
