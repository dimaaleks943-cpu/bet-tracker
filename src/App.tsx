import "./App.css";
import { Box } from "@mui/material";
import { Header } from "./components/Header/Header";
import { Main } from "./pages/Main/Main";
import { Routes, Route } from "react-router-dom";
import { Statistics } from "./pages/Statistics/Statistics";
import { AddValue } from "./pages/AddValue/AddValue";
import { ROUTES } from "./constants/routes.consts";

function App() {
  return (
    <Box>
      <Header />
      <Routes>
        <Route path={ROUTES.MAIN} element={<Main />} />
        <Route path={ROUTES.STATISTICS} element={<Statistics />} />
        <Route path={ROUTES.ADD} element={<AddValue />} />
      </Routes>
    </Box>
  );
}

export default App;
