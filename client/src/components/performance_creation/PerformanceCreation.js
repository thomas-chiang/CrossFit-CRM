import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./performance_creation_functions";
import React from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import { AppContext } from "../../utils/reactContexts";

function Component({ course_id, user_id, workout, setUpdate }) {
  const [movements, setMovements] = useState([]);
  const [workoutPerformance, setWorkoutPerformance] = useState({
    round: workout.round || "",
    extra_count: workout.extra_count || "",
    minute: workout.minute || "",
    extra_sec: workout.extra_sec || ""
  });

  useEffect(() => {
    Functions.getWorkoutMovements(workout.id, setMovements);
  }, [workout]);

  useEffect(() => {
    setWorkoutPerformance({
      round: workout.round || "",
      extra_count: workout.extra_count || "",
      minute: workout.minute || "",
      extra_sec: workout.extra_sec || ""
    });
  }, [workout]);

  console.log(movements);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ mr: 1 }}>{workout.name}: </Typography>
        <TextField
          sx={{ mr: 1, width: 100 }}
          type="number"
          size="small"
          label="round"
          variant="outlined"
          value={workoutPerformance.round}
          onChange={(e) => setWorkoutPerformance({ ...workoutPerformance, round: e.target.value })}
        />
        <TextField
          sx={{ mr: 1, width: 120 }}
          type="number"
          size="small"
          label="extra count"
          variant="outlined"
          value={workoutPerformance.extra_count}
          onChange={(e) => setWorkoutPerformance({ ...workoutPerformance, extra_count: e.target.value })}
        />
        <TextField
          sx={{ mr: 1, width: 100 }}
          type="number"
          size="small"
          label="minute"
          variant="outlined"
          value={workoutPerformance.minute}
          onChange={(e) => setWorkoutPerformance({ ...workoutPerformance, minute: e.target.value })}
        />
        <TextField
          sx={{ mr: 1, width: 100 }}
          type="number"
          size="small"
          label="extra sec"
          variant="outlined"
          value={workoutPerformance.extra_sec}
          onChange={(e) => setWorkoutPerformance({ ...workoutPerformance, extra_sec: e.target.value })}
        />
      </Box>
      {movements.map((movement, index) => (
        <Box key={index}>
          <CreatePerformance
            workout_movement_id={movement.id}
            course_id={course_id}
            user_id={user_id}
            workout_id={workout.id}
            setUpdate={setUpdate}
            movement={movement}
            workoutPerformance={workoutPerformance}
          />
        </Box>
      ))}
    </>
  );
}

export default Component;

function CreatePerformance({ course_id, user_id, workout_id, setUpdate, movement, workoutPerformance, workout_movement_id }) {
  const setAlert = useContext(AppContext).setAlert;

  const [auth, setAuth] = useState(true); // auth handler
  const [performance, setPerformance] = useState({
    workout_movement_id,
    movement_id: movement.movement_id,
    course_id,
    user_id,
    workout_id,
    round: workoutPerformance.round,
    extra_count: workoutPerformance.extra_count,
    minute: workoutPerformance.minute,
    extra_sec: workoutPerformance.extra_sec,
    kg: movement.kg || "",
    meter: movement.meter || "",
    rep: movement.rep || "",
    cal: movement.cal || ""
  });
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setPerformance({
      ...performance,
      round: workoutPerformance.round,
      extra_count: workoutPerformance.extra_count,
      minute: workoutPerformance.minute,
      extra_sec: workoutPerformance.extra_sec
    });
  }, [workoutPerformance]);

  useEffect(() => {
    setPerformance({
      ...performance,
      movement_id: movement.movement_id,
      workout_id,
      kg: movement.kg || "",
      meter: movement.meter || "",
      rep: movement.rep || "",
      cal: movement.cal || ""
    });
  }, [movement]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Box sx={{ display: "flex", alignItems: "stretch" }}>
      <Typography sx={{ width: 1 / 3, display: "flex", alignItems: "center", justifyContent: "right", mr: 1 }}>
        {movement.name}
      </Typography>
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="kg"
        variant="outlined"
        value={performance.kg}
        onChange={(e) => {
          setPerformance({ ...performance, kg: e.target.value });
        }}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="rep"
        variant="outlined"
        value={performance.rep}
        onChange={(e) => {
          setPerformance({ ...performance, rep: e.target.value });
        }}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="meter"
        variant="outlined"
        value={performance.meter}
        onChange={(e) => {
          setPerformance({ ...performance, meter: e.target.value });
        }}
      />
      <TextField
        sx={{ mr: 1, mt: 1, width: 100 }}
        size="small"
        type="number"
        label="cal"
        variant="outlined"
        value={performance.cal}
        onChange={(e) => {
          setPerformance({ ...performance, cal: e.target.value });
        }}
      />
      {/*  <TextField  sx={{mr:1, mt:1, width: 100}} size='small' type='number' label="sec" variant="outlined" value={performance.sec} onChange={e=>{setPerformance({...performance, sec: e.target.value})}}/> */}
      <Button
        sx={{ mr: 1, mt: 1, width: 250 }}
        size="small"
        type=""
        variant="contained"
        onClick={() => {
          Functions.createPerformance(performance, setAuth, setUpdate, setDisable, setAlert);
        }}
        disabled={
          (!workoutPerformance.round &&
            !workoutPerformance.extra_count &&
            !workoutPerformance.minute &&
            !workoutPerformance.extra_sec) ||
          disable
        }
      >
        create performance
      </Button>
    </Box>
  );
}
