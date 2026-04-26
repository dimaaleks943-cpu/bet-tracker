import "./App.css";
import { Box } from "@mui/material";
import {Header} from "./componets/Header/Header.tsx";
import {Main} from "./pages/Main/Main.tsx";
import { Routes, Route } from 'react-router-dom';
import {Statistics} from "./pages/Statistics/Statistics.tsx";
import AddValue from "./pages/AddValue/AddValue.tsx";


function App() {


  return (
      <Box>
        <Header/>
          <Routes>
              <Route path="/" element={<Main/>} />
              <Route path="/statistics" element={<Statistics/>} />
              <Route path="/add" element={<AddValue/>} />
          </Routes>
      </Box>


  );
}

export default App;
