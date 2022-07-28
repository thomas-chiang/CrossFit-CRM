import { useState, useEffect, useContext } from "react";
import Functions from "./public_workouts_functions";
import { AppContext } from "../../utils/reactContexts";
import PublicWorkout from "../public_workout/PublicWorkout";
import { Box } from "@mui/material";

function Component() {
  const appContext = useContext(AppContext);
  const [passDownUpdate, setPassDownUpdate] = useState(Date());
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    const timeId = setTimeout(() => setAlert(null), 2000);
    return () => clearTimeout(timeId);
  }, [alert]);

  // all workouts
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    Functions.getWorkoutsWithMovements(setWorkouts);
  }, [appContext.update, passDownUpdate]);

  return (
    <Box sx={{ m: 3, mb: 0, display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
      {workouts.map((workout, index) => (
        <PublicWorkout key={index} workout={workout} setPassDownUpdate={setPassDownUpdate} passDownUpdate={passDownUpdate} />
      ))}
    </Box>
  );
}

export default Component;
