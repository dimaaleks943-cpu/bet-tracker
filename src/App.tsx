import { useEffect, useState } from "react";
import "./App.css";
import AddBetForm from "./AddBetForm/AddBetForm.tsx";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { BalanceViewer } from "./BalanceViewer/BalanceViewer.tsx";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);


  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        minWidth: "100%",
        height: "80%",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Добавить ставку" />
        <Tab label="Список ставок" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <AddBetForm />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <BalanceViewer />
      </TabPanel>

    </Paper>
  );
}

export default App;
