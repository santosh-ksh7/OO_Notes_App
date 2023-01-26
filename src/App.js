import { createTheme, Paper, ThemeProvider } from "@mui/material";
import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import SignUp from "./components/Signup";


export const userInfo = createContext();

function App() {

  // Dark mode logic
  const [mode, setMode] = useState('light');
  const myTheme = createTheme({
    palette: {
      mode,
    },
  })
  // Dark mode logic

  const[userData, setUserData] = useState(null);

  return (
    <ThemeProvider theme={myTheme}>
      <userInfo.Provider value={{userData, setUserData, setMode, mode}}>
        <Paper className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign_up" element={<SignUp />} />
          </Routes>
        </Paper>
      </userInfo.Provider>
    </ThemeProvider>
  );
}

export default App;
