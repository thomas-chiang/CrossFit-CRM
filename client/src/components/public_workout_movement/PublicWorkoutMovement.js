import { useState, useEffect } from "react";
import Functions from "./public_workout_movement_functions";
import { Box } from "@mui/material";

function Component({ movement }) {
  const workout_movement_id = movement.id;
  const [updatedMovement, setUpdatedMovement] = useState(movement);

  useEffect(() => {
    Functions.getWorkoutMovement(setUpdatedMovement, workout_movement_id);
  }, [movement]);

  return (
    <Box sx={{ maxHeight: "100%", display: "flex", alignItems: "center" }}>
      <Box sx={{ m: 1, width: 150, textAlign: "end" }}>{movement.name}:</Box>
      {updatedMovement?.kg ? <Box sx={{ m: 1 }}>{updatedMovement?.kg} kg(s)</Box> : <></>}
      {updatedMovement?.rep ? <Box sx={{ m: 1 }}>{updatedMovement?.rep} rep(s)</Box> : <></>}
      {updatedMovement?.meter ? <Box sx={{ m: 1 }}>{updatedMovement?.meter} meter(s)</Box> : <></>}
      {updatedMovement?.cal ? <Box sx={{ m: 1 }}>{updatedMovement?.cal} cal(s)</Box> : <></>}
    </Box>
  );
}

export default Component;
