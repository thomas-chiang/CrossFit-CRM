import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./update_workout_functions";
import Select from "react-select";
import UpdateWorkoutMovement from "../update_workout_movement/UpdateWorkoutMovement";
import { Paper, Button, Box, TextField, TextareaAutosize } from "@mui/material";
import { AppContext } from "../../utils/reactContexts";

function Component({ workout, movementOptions, passDownUpdate, setPassDownUpdate }) {
  const [updateFromChild, setUpdateFromChild] = useState(Date());
  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth
  const [updatingWorkout, setUpdatingWorkout] = useState(workout);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [newWorkoutMovement, setNewWorkoutMovement] = useState({
    workout_id: workout.id,
    kg: "",
    rep: "",
    meter: "",
    cal: ""
    // sec: ''
  });
  const [disable, setDisable] = useState(false);
  const setAlert = useContext(AppContext).setAlert;

  useEffect(() => {
    Functions.getWorkout(workout.id, setUpdatingWorkout);
  }, [update, updateFromChild, workout, passDownUpdate]); // must add 'workout'

  useEffect(() => {
    setNewWorkoutMovement({ ...newWorkoutMovement, movement_id: selectedMovement?.id });
  }, [selectedMovement]);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 40,
      width: 200
    })
  };

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Paper elevation={5} sx={{ p: 1, m: 1 }}>
      <Box sx={{ display: "flex" }}>
        <TextField
          sx={{ m: 1, flexGrow: 1 }}
          size="small"
          label="Workout name"
          variant="outlined"
          value={updatingWorkout.name || ""}
          onChange={(e) => setUpdatingWorkout({ ...updatingWorkout, name: e.target.value })}
        />
        <TextField
          sx={{ m: 1, width: 100 }}
          type="number"
          size="small"
          label="round"
          variant="outlined"
          value={updatingWorkout.round || ""}
          onChange={(e) => setUpdatingWorkout({ ...updatingWorkout, round: e.target.value })}
        />
        <TextField
          sx={{ m: 1, width: 120 }}
          type="number"
          size="small"
          label="extra count"
          variant="outlined"
          value={updatingWorkout.extra_count || ""}
          onChange={(e) => setUpdatingWorkout({ ...updatingWorkout, extra_count: e.target.value })}
        />
        <TextField
          sx={{ m: 1, width: 100 }}
          type="number"
          size="small"
          label="minute"
          variant="outlined"
          value={updatingWorkout.minute || ""}
          onChange={(e) => setUpdatingWorkout({ ...updatingWorkout, minute: e.target.value })}
        />
        <TextField
          sx={{ m: 1, width: 100 }}
          type="number"
          size="small"
          label="extra sec"
          variant="outlined"
          value={updatingWorkout.extra_sec || ""}
          onChange={(e) => setUpdatingWorkout({ ...updatingWorkout, extra_sec: e.target.value })}
        />
      </Box>
      {updatingWorkout.movements ? (
        updatingWorkout.movements.map((movement, index) => (
          <UpdateWorkoutMovement
            key={index}
            movement={movement}
            workout_id={workout.id}
            setPassDownUpdate={setPassDownUpdate}
            passDownUpdate={passDownUpdate}
            setUpdateFromChild={setUpdateFromChild}
          />
        ))
      ) : (
        <></>
      )}
      <Box sx={{ maxHeight: "100%", display: "flex" }}>
        <Box sx={{ m: 1 }}>
          <Select
            maxMenuHeight={120}
            placeholder="Select Movement"
            defaultValue={selectedMovement}
            onChange={setSelectedMovement}
            options={movementOptions}
            styles={customStyles}
          />
        </Box>
        <TextField
          sx={{ m: 1, width: 100 }}
          size="small"
          type="number"
          label="kg"
          variant="outlined"
          value={newWorkoutMovement.kg}
          onChange={(e) => setNewWorkoutMovement({ ...newWorkoutMovement, kg: e.target.value })}
        />
        <TextField
          sx={{ m: 1, width: 100 }}
          size="small"
          type="number"
          label="rep"
          variant="outlined"
          value={newWorkoutMovement.rep}
          onChange={(e) => setNewWorkoutMovement({ ...newWorkoutMovement, rep: e.target.value })}
        />
        <TextField
          sx={{ m: 1, width: 100 }}
          size="small"
          type="number"
          label="meter"
          variant="outlined"
          value={newWorkoutMovement.meter}
          onChange={(e) => setNewWorkoutMovement({ ...newWorkoutMovement, meter: e.target.value })}
        />
        <TextField
          sx={{ m: 1, width: 100 }}
          size="small"
          type="number"
          label="cal"
          variant="outlined"
          value={newWorkoutMovement.cal}
          onChange={(e) => setNewWorkoutMovement({ ...newWorkoutMovement, cal: e.target.value })}
        />
        <Button
          sx={{ m: 1 }}
          size="small"
          disabled={!selectedMovement || disable}
          onClick={() => {
            Functions.addWorkoutMovement(newWorkoutMovement, setAuth, setUpdate, setPassDownUpdate, setDisable, setAlert);
          }}
          variant="contained"
        >
          {" "}
          add movement
        </Button>
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextareaAutosize
          placeholder="workout note"
          style={{ margin: 8, flexGrow: 1 }}
          minRows={3}
          value={updatingWorkout.note || ""}
          onChange={(e) => setUpdatingWorkout({ ...updatingWorkout, note: e.target.value })}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Button
          disabled={disable}
          sx={{ m: 1 }}
          variant="contained"
          onClick={() => {
            Functions.updateOnlyWorkout(updatingWorkout, setAuth, setUpdate, setPassDownUpdate, setDisable, setAlert);
          }}
        >
          update workout excluding movements
        </Button>
        <Button
          disabled={disable}
          sx={{ m: 1 }}
          variant="contained"
          onClick={() => {
            Functions.deleteWorkout(updatingWorkout.id, setAuth, setPassDownUpdate, setDisable, setAlert);
          }}
          color="secondary"
        >
          delete workout
        </Button>
      </Box>
    </Paper>
  );
}

export default Component;
