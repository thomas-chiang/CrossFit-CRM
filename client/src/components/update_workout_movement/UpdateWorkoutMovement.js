import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./update_workout_movement_functions";
import { Button, Box, TextField, CardMedia } from "@mui/material";
import { AppContext } from "../../utils/reactContexts";

function Component({ movement, setPassDownUpdate, setUpdateFromChild }) {
  const setAlert = useContext(AppContext).setAlert;

  const workout_movement_id = movement.id;
  const [auth, setAuth] = useState(true); // auth
  const [update, setUpdate] = useState(Date());
  const [updatedMovement, setUpdatedMovement] = useState(movement);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    Functions.getWorkoutMovement(setUpdatedMovement, workout_movement_id);
  }, [update, movement]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Box sx={{ maxHeight: "100%", display: "flex", alignItems: "center" }}>
      <Box sx={{ m: 1, display: "flex", alignItems: "center", justifyContent: "left", flexGrow: 1 }}>
        <Box sx={{ width: 80, display: "flex", alignItems: "center", justifyContent: "center", mx: 1 }}>
          <CardMedia
            sx={{ flexGrow: 1, borderRadius: 2 }}
            component="img"
            width="50"
            image={`https://img.youtube.com/vi/${movement.youtube_id}/0.jpg`}
          />
        </Box>
        {movement.name}:
      </Box>
      <TextField
        sx={{ m: 1, width: 100 }}
        size="small"
        type="number"
        label="kg"
        variant="outlined"
        value={updatedMovement?.kg || ""}
        onChange={(e) => setUpdatedMovement({ ...updatedMovement, kg: e.target.value })}
      />
      <TextField
        sx={{ m: 1, width: 100 }}
        size="small"
        type="number"
        label="rep"
        variant="outlined"
        value={updatedMovement?.rep || ""}
        onChange={(e) => setUpdatedMovement({ ...updatedMovement, rep: e.target.value })}
      />
      <TextField
        sx={{ m: 1, width: 100 }}
        size="small"
        type="number"
        label="meter"
        variant="outlined"
        value={updatedMovement?.meter || ""}
        onChange={(e) => setUpdatedMovement({ ...updatedMovement, meter: e.target.value })}
      />
      <TextField
        sx={{ m: 1, width: 100 }}
        size="small"
        type="number"
        label="cal"
        variant="outlined"
        value={updatedMovement?.cal || ""}
        onChange={(e) => setUpdatedMovement({ ...updatedMovement, cal: e.target.value })}
      />
      <Button
        disabled={disable}
        sx={{ m: 1 }}
        size="small"
        onClick={() => {
          Functions.updateWorkoutMovement(updatedMovement, setUpdate, setPassDownUpdate, setAuth, setDisable, setAlert);
        }}
        variant="contained"
      >
        update
      </Button>
      <Button
        disabled={disable}
        sx={{ m: 1 }}
        size="small"
        onClick={() => {
          Functions.deleteWorkoutMovement(
            workout_movement_id,
            setUpdateFromChild,
            setPassDownUpdate,
            setAuth,
            setDisable,
            setAlert
          );
        }}
        variant="contained"
        color="secondary"
      >
        delete
      </Button>
    </Box>
  );
}

export default Component;
