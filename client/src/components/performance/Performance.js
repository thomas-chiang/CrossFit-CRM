import { useState, useEffect, useContext } from "react";
import Functions from "./performance_functions";
import { Navigate } from "react-router-dom"; // auth handler
import { Paper, Typography, Button, Box, TextField } from "@mui/material";
import { AppContext } from "../../utils/reactContexts";

function Component({ performance, setUpdate }) {
  const setAlert = useContext(AppContext).setAlert;

  const [auth, setAuth] = useState(true); // auth handler
  const [updatingPerformance, setUpdatingPerformance] = useState(performance);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    Functions.getPerformanceWithMovementWorkoutName(performance, setUpdatingPerformance);
  }, [performance]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Paper elevation={5} sx={{ p: 1, my: 1, display: "flex", alignItems: "center" }}>
      <Box sx={{ mr: 1, mt: 1, width: 1 / 7, display: "flex", justifyContent: "space-around" }}>
        <Box>{performance.workout_name}</Box> / <Box>{performance.name}</Box>:{" "}
      </Box>
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        type="number"
        size="small"
        label="round"
        variant="outlined"
        value={updatingPerformance.round || ""}
        onChange={(e) => setUpdatingPerformance({ ...updatingPerformance, round: e.target.value })}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 120 }}
        type="number"
        size="small"
        label="extra count"
        variant="outlined"
        value={updatingPerformance.extra_count || ""}
        onChange={(e) => setUpdatingPerformance({ ...updatingPerformance, extra_count: e.target.value })}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        type="number"
        size="small"
        label="minute"
        variant="outlined"
        value={updatingPerformance.minute || ""}
        onChange={(e) => setUpdatingPerformance({ ...updatingPerformance, minute: e.target.value })}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        type="number"
        size="small"
        label="extra sec"
        variant="outlined"
        value={updatingPerformance.extra_sec || ""}
        onChange={(e) => setUpdatingPerformance({ ...updatingPerformance, extra_sec: e.target.value })}
      />
      <Typography sx={{ mr: 1, mt: 1 }}> / </Typography>
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="kg"
        variant="outlined"
        value={updatingPerformance.kg || ""}
        onChange={(e) => {
          setUpdatingPerformance({ ...updatingPerformance, kg: e.target.value });
        }}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="rep"
        variant="outlined"
        value={updatingPerformance.rep || ""}
        onChange={(e) => {
          setUpdatingPerformance({ ...updatingPerformance, rep: e.target.value });
        }}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="meter"
        variant="outlined"
        value={updatingPerformance.meter || ""}
        onChange={(e) => {
          setUpdatingPerformance({ ...updatingPerformance, meter: e.target.value });
        }}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="cal"
        variant="outlined"
        value={updatingPerformance.cal || ""}
        onChange={(e) => {
          setUpdatingPerformance({ ...updatingPerformance, cal: e.target.value });
        }}
      />
      <Button
        disabled={
          (!updatingPerformance.round &&
            !updatingPerformance.extra_count &&
            !updatingPerformance.minute &&
            !updatingPerformance.extra_sec) ||
          disable
        }
        sx={{ mr: 1, mt: 1 }}
        variant="contained"
        onClick={() => Functions.updatePerformance(updatingPerformance, setAuth, setUpdate, setDisable, setAlert)}
      >
        update
      </Button>
      <Button
        disabled={disable}
        sx={{ mr: 1, mt: 1 }}
        variant="contained"
        color="secondary"
        onClick={() => Functions.deletePerformance(updatingPerformance, setAuth, setUpdate, setDisable, setAlert)}
      >
        delete
      </Button>
    </Paper>
  );
}

export default Component;
