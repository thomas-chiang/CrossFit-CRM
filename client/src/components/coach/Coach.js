import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./coach_functions";
import { Typography, Card, Button, Box } from "@mui/material";

function Component() {
  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    Functions.getCoaches(setCoaches);
  }, [update]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Box sx={{ m: 3, display: "flex", flexWrap: "wrap", alignItems: "start" }}>
      {coaches.map((coach, index) => (
        <CoachBox key={index} coach={coach} setUpdate={setUpdate} setAuth={setAuth} />
      ))}
    </Box>
  );
}

export default Component;

function CoachBox({ coach, setUpdate, setAuth }) {
  return (
    <Card sx={{ p: 1, m: 1 }}>
      <Typography>{coach.name}</Typography>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Button
          sx={{ mt: 1, bottom: 0 }}
          size="small"
          variant="contained"
          color={coach.valid == 1 ? "secondary" : "primary"}
          onClick={() => Functions.updateValidStatus(coach.id, coach.valid == 1 ? 0 : 1, setUpdate, setAuth)}
        >
          {coach.valid == 1 ? "invalidate" : "validate"}
        </Button>
      </Box>
    </Card>
  );
}
