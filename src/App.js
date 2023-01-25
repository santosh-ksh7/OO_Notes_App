import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import SignUp from "./components/Signup";


export const userInfo = createContext();

function App() {

  const[userData, setUserData] = useState(null);

  return (
    <userInfo.Provider value={{userData, setUserData}}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign_up" element={<SignUp />} />
        </Routes>
      </div>
    </userInfo.Provider>
  );
}

export default App;
