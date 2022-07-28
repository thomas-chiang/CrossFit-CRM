import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import PublicMovement from "./components/public_movement/PublicMovement";
import PublicWorkout from "./components/public_workouts/PublicWorkouts";
import CalendarMember from "./components/calender_member/CalendarMember";
import Leaderboard from "./components/leaderboard/Leaderboard";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import { AppContext } from "./utils/reactContexts.js";
import { useState, useEffect } from "react";
import Analysis2 from "./components/analysis2/Analysis2";

import { Box, Alert } from "@mui/material";

function App() {
  const [update, setUpdate] = useState(true);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    const timeId = setTimeout(() => setAlert(null), 2000);
    return () => clearTimeout(timeId);
  }, [alert]);

  const contextValue = {
    update,
    setUpdate,
    user,
    setUser,
    alert,
    setAlert
  };

  return (
    <AppContext.Provider value={contextValue}>
      {alert ? (
        <Alert
          severity="info"
          variant="filled"
          sx={{
            position: "fixed",
            top: 10,
            right: 0,
            left: 0,
            mx: "auto",
            width: Math.max(alert.length * 10, 150),
            display: "flex",
            justifyContent: "center",
            backgroundColor: "gray",
            zIndex: 10000
          }}
        >
          {alert}
        </Alert>
      ) : (
        <></>
      )}
      <Box
        sx={{
          background: `url(${require("./gym.jpeg")})  center center fixed`,
          backgroundSize: "cover",
          width: 1,
          height: 1,
          minHeight: "100vh"
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<CalendarMember />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movement" element={<PublicMovement />} />
          <Route path="/workout" element={<PublicWorkout />} />
          <Route path="/analysis" element={<Analysis2 />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </AppContext.Provider>
  );
}

export default App;
