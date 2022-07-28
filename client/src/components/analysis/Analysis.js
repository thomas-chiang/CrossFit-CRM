import Line from "../line/Line";
import Select from "react-select";
import Functions from "./analysis_functions";
import { useEffect, useState } from "react";
import { Paper, Box, Typography } from "@mui/material";

function Component() {
  const [lineData, setLineDate] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutMovements, setWorkoutMovements] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState(null);

  useEffect(() => {
    Functions.getUsersByRole(1, setMembers);
  }, []);

  useEffect(() => {
    setSelectedWorkout(null);
    if (selectedMember) Functions.getUserWorkouts(selectedMember.id, setUserWorkouts);
  }, [selectedMember]);

  useEffect(() => {
    setSelectedMovement(null);
    if (selectedWorkout) Functions.getDistinctWorkoutMovements(selectedWorkout.workout_id, setWorkoutMovements);
  }, [selectedWorkout]);

  useEffect(() => {
    if (selectedMember && selectedWorkout && selectedMovement)
      Functions.getPerformanceByWorkoutMovement(
        selectedMember.id,
        selectedWorkout.workout_id,
        selectedMovement.movement_id,
        setLineDate
      );
  }, [selectedMovement, selectedMember]);

  return (
    <Box sx={{ p: 3, height: "auto" }}>
      <Paper elevation={5}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", pt: 1 }}>
          <Typography sx={{ flexBasis: "100%", textAlign: "center", fontWeight: "bold", my: 1 }} variant="h4">
            Analysis
          </Typography>
          <Box sx={{ width: 200, mr: 1 }}>
            <Select placeholder={"Select user"} defaultValue={selectedMember} onChange={setSelectedMember} options={members} />
          </Box>
          {selectedMember ? (
            <Box sx={{ width: 200, mr: 1, display: "flex", alignItems: "center" }}>
              {userWorkouts?.length > 0 ? (
                <Box sx={{ width: 1 }}>
                  <Select
                    placeholder={"Select workout"}
                    value={selectedWorkout}
                    onChange={setSelectedWorkout}
                    options={userWorkouts}
                  />
                </Box>
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <i>No workout has been done. Please pick another user.</i>{" "}
                </Box>
              )}
            </Box>
          ) : (
            <></>
          )}

          {selectedWorkout ? (
            <Box sx={{ width: 200, mr: 1 }}>
              <Select
                placeholder={"Select movement"}
                value={selectedMovement}
                onChange={setSelectedMovement}
                options={workoutMovements}
              />
            </Box>
          ) : (
            <></>
          )}
        </Box>
        <Box sx={{ p: 1 }}>{lineData ? <Line lineData={lineData} /> : <></>}</Box>
      </Paper>
    </Box>
  );
}

export default Component;
