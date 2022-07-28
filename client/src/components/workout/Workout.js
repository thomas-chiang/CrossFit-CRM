import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./workout_functions";
import Select from "react-select";
import { AppContext } from "../../utils/reactContexts";
import UpdateWorkout from "../update_workout/UpdateWorkout";
import { Paper, Button, Box, TextField, TextareaAutosize, Alert, Typography, CardMedia } from "@mui/material";

function Component() {
  const appContext = useContext(AppContext);
  const setAlert = useContext(AppContext).setAlert;

  const [passDownUpdate, setPassDownUpdate] = useState(Date());
  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth
  const [disable, setDisable] = useState(false);

  // all workouts
  const [workouts, setWorkouts] = useState([]);

  // create workout
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    round: "",
    extra_count: "",
    minute: "",
    extra_sec: "",
    note: ""
  });

  const [movementOptions, setMovementOptions] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [movementDetail, setMovementDetail] = useState({
    kg: "",
    rep: "",
    meter: "",
    cal: ""
    //sec: ''
  });
  const [movementArr, setMovementArr] = useState([]);

  // workouts

  useEffect(() => {
    Functions.getWorkoutsWithMovements(setWorkouts);
    // Functions.getMovementOptions(setMovementOptions)
  }, [update, appContext.update, passDownUpdate]);

  useEffect(() => {
    Functions.getMovementOptions(setMovementOptions);
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
    <Box sx={{ m: 3, display: "flex", flexWrap: "wrap" }}>
      <Paper elevation={5} sx={{ p: 1, m: 1 }}>
        <Box sx={{ display: "flex" }}>
          <TextField
            sx={{ m: 1, flexGrow: 1 }}
            size="small"
            label="Workout name"
            variant="outlined"
            value={newWorkout.name}
            onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
          />
          <TextField
            sx={{ m: 1, width: 100 }}
            type="number"
            size="small"
            label="round"
            variant="outlined"
            value={newWorkout.round}
            onChange={(e) => setNewWorkout({ ...newWorkout, round: e.target.value })}
          />
          <TextField
            sx={{ m: 1, width: 120 }}
            type="number"
            size="small"
            label="extra count"
            variant="outlined"
            value={newWorkout.extra_count}
            onChange={(e) => setNewWorkout({ ...newWorkout, extra_count: e.target.value })}
          />
          <TextField
            sx={{ m: 1, width: 100 }}
            type="number"
            size="small"
            label="minute"
            variant="outlined"
            value={newWorkout.minute}
            onChange={(e) => setNewWorkout({ ...newWorkout, minute: e.target.value })}
          />
          <TextField
            sx={{ m: 1, width: 100 }}
            type="number"
            size="small"
            label="extra sec"
            variant="outlined"
            value={newWorkout.extra_sec}
            onChange={(e) => setNewWorkout({ ...newWorkout, extra_sec: e.target.value })}
          />
        </Box>
        {movementArr.length > 0 ? (
          movementArr.map((movement, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "start", m: 1, ml: 2 }}>
              <Box sx={{ width: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CardMedia
                  sx={{ flexGrow: 1, borderRadius: 2 }}
                  component="img"
                  width="50"
                  image={`https://img.youtube.com/vi/${movement.youtube_id}/0.jpg`}
                />
              </Box>
              <Box sx={{ m: 1, ml: 2 }}>{movement.name}:</Box>
              {movement.kg ? <Box sx={{ m: 1 }}>{movement.kg} kg(s)</Box> : <></>}
              {movement.rep ? <Box sx={{ m: 1 }}>{movement.rep} rep(s)</Box> : <></>}
              {movement.meter ? <Box sx={{ m: 1 }}>{movement.meter} meter(s)</Box> : <></>}
              {movement.cal ? <Box sx={{ m: 1 }}>{movement.cal} cal(s)</Box> : <></>}
              <Button
                sx={{ m: 1 }}
                size="small"
                onClick={() => {
                  setMovementArr(movementArr.filter((m, i) => i !== index));
                }}
                variant="contained"
                color="secondary"
              >
                remove movement
              </Button>
            </Box>
          ))
        ) : (
          <></>
        )}
        <Box sx={{ display: "flex" }}>
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
            value={movementDetail.kg}
            onChange={(e) => setMovementDetail({ ...movementDetail, kg: e.target.value })}
          />
          <TextField
            sx={{ m: 1, width: 100 }}
            size="small"
            type="number"
            label="rep"
            variant="outlined"
            value={movementDetail.rep}
            onChange={(e) => setMovementDetail({ ...movementDetail, rep: e.target.value })}
          />
          <TextField
            sx={{ m: 1, width: 100 }}
            size="small"
            type="number"
            label="meter"
            variant="outlined"
            value={movementDetail.meter}
            onChange={(e) => setMovementDetail({ ...movementDetail, meter: e.target.value })}
          />
          <TextField
            sx={{ m: 1, width: 100 }}
            size="small"
            type="number"
            label="cal"
            variant="outlined"
            value={movementDetail.cal}
            onChange={(e) => setMovementDetail({ ...movementDetail, cal: e.target.value })}
          />
          <Button
            sx={{ m: 1 }}
            size="small"
            disabled={!selectedMovement}
            onClick={() => {
              setMovementArr([
                ...movementArr,
                {
                  ...movementDetail,
                  movement_id: selectedMovement.id,
                  name: selectedMovement.name,
                  youtube_id: selectedMovement.youtube_id
                }
              ]);
            }}
            variant="contained"
          >
            add movement
          </Button>
        </Box>
        <Box sx={{ display: "flex" }}>
          <TextareaAutosize
            placeholder="workout note"
            style={{ margin: 8, flexGrow: 1 }}
            minRows={3}
            value={newWorkout.note}
            onChange={(e) => setNewWorkout({ ...newWorkout, note: e.target.value })}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            disabled={movementArr.length == 0 || disable}
            onClick={() => Functions.createWorkout(newWorkout, movementArr, setUpdate, setAuth, setDisable, setAlert)}
          >
            create workout
          </Button>
        </Box>
      </Paper>

      {workouts.map((workout, index) => (
        <UpdateWorkout
          key={index}
          movementOptions={movementOptions}
          workout={workout}
          setPassDownUpdate={setPassDownUpdate}
          passDownUpdate={passDownUpdate}
        />
      ))}
    </Box>
  );
}

export default Component;
