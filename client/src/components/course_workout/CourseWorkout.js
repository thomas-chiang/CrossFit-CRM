import { useState, useEffect } from "react";
import Functions from "./course_workout_functions";
import { Paper, Typography, Divider, Box, CardMedia } from "@mui/material";

function Component({ workout }) {
  const [distinctMovements, setDistinctMovements] = useState([]);
  const [workoutWithMovements, setWorkoutWithMovements] = useState(null);
  useEffect(() => {
    Functions.getWorkout(workout.id, setWorkoutWithMovements);
    Functions.getDistinctWorkoutMovements(workout.id, setDistinctMovements);
  }, [workout.id]);

  return (
    <Paper elevation={5} sx={{ p: 2, mr: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ m: 1, fontWeight: "bold" }}> {workout.name || ""}:</Box>
        {workout.round ? <Box sx={{ m: 1 }}> {workout.round} round(s)</Box> : <></>}
        {workout.extra_count ? <Box sx={{ m: 1 }}> {workout.extra_count} extra count(s)</Box> : <></>}
        {workout.minute ? <Box sx={{ m: 1 }}> {workout.minute} minute(s)</Box> : <></>}
        {workout.extra_sec ? <Box sx={{ m: 1 }}> {workout.extra_sec} extra sec(s)</Box> : <></>}
      </Box>
      <Divider sx={{ mt: 1 }} />
      <Box sx={{ display: "flex" }}>
        <Box>
          {workoutWithMovements?.movements.map((movement, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "stretch" }}>
              <Box sx={{ m: 1, width: 150, textAlign: "end" }}>{movement.name}:</Box>
              {movement?.kg ? <Box sx={{ m: 1 }}>{movement?.kg} kg(s)</Box> : <></>}
              {movement?.rep ? <Box sx={{ m: 1 }}>{movement?.rep} rep(s)</Box> : <></>}
              {movement?.meter ? <Box sx={{ m: 1 }}>{movement?.meter} meter(s)</Box> : <></>}
              {movement?.cal ? <Box sx={{ m: 1 }}>{movement?.cal} cal(s)</Box> : <></>}
            </Box>
          ))}
        </Box>
        <Divider orientation="vertical" sx={{ m: 1 }} flexItem />
        <Box sx={{ display: "flex", alignItems: "start" }}>
          {distinctMovements.map((movement, index) => (
            <MovementBox key={index} id={movement.id} movement={movement} />
          ))}
        </Box>
      </Box>
      <Divider sx={{ mt: 1 }} />
    </Paper>
  );
}

export default Component;

function MovementBox({ id, movement, setUpdate, setAuth }) {
  const [updateingMovement, setUpdateingMovement] = useState({
    name: movement.name,
    demo_link: movement.demo_link,
    id
  });
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setUpdateingMovement({
      name: movement.name,
      demo_link: movement.demo_link,
      id
    });
  }, [movement]);

  return (
    <Paper
      elevation={5}
      sx={{ m: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }}
      onClick={() => setPlay(!play)}
    >
      <Box sx={{ mx: 1 }}>
        <Typography>{updateingMovement.name}</Typography>
      </Box>

      {movement.demo_link ? (
        <Box sx={{ flexBasis: "100%" }}>
          {play ? (
            <iframe
              title={movement.demo_link}
              frameBorder="0"
              src={`${movement.embed_link}?autoplay=1&mute=1&showinfo=0&modestbranding=1&rel=0`}
              allow="autoplay"
              muted
              style={{ height: 140 }}
            />
          ) : (
            <CardMedia
              sx={{ mb: 0.5 }}
              component="img"
              height="100"
              image={`https://img.youtube.com/vi/${movement.youtube_id}/0.jpg`}
            />
          )}
        </Box>
      ) : (
        <></>
      )}
    </Paper>
  );
}
