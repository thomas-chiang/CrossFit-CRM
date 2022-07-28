import Select from "react-select";
import Functions from "./analysis2_functions";
import { useEffect, useState } from "react";
import { Paper, Box, Typography, Divider, TextareaAutosize, CardMedia } from "@mui/material";
import AnalysisBar from "../analysis_bar/AnalysisBar";

function Component() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutWithMovements, setWorkoutWithMovements] = useState(null);
  const [movementArr, setMovementArr] = useState(null);
  const [distinctMovements, setDistinctMovements] = useState([]);

  useEffect(() => {
    Functions.getUsersByRole(1, setMembers);
  }, []);

  useEffect(() => {
    setSelectedWorkout(null);
    if (selectedMember) Functions.getUserWorkouts(selectedMember.id, setUserWorkouts);
  }, [selectedMember]);

  useEffect(() => {
    if (selectedWorkout) {
      Functions.getDistinctWorkoutMovements(selectedWorkout.workout_id, setDistinctMovements);
      Functions.getWorkoutsWithMovements(selectedWorkout.workout_id, setWorkoutWithMovements);
    }
  }, [selectedWorkout]);

  useEffect(() => {
    if (selectedMember && selectedWorkout && distinctMovements)
      Functions.getPerformanceByWorkout(selectedMember.id, selectedWorkout.workout_id, distinctMovements, setMovementArr);
  }, [distinctMovements]);

  return (
    <Box sx={{ p: 3, height: "auto" }}>
      <Paper elevation={5}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", pt: 1 }}>
          <Typography sx={{ flexBasis: "100%", textAlign: "center", fontWeight: "bold", my: 1 }} variant="h4">
            Analysis
          </Typography>
          <Box sx={{ width: 200, mr: 1 }}>
            <Select placeholder={"Select User"} defaultValue={selectedMember} onChange={setSelectedMember} options={members} />
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
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", p: 1 }}>
          {movementArr ? (
            <>
              <Paper elevation={5} sx={{ m: 1, mb: 3, p: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ m: 1, fontWeight: "bold" }}> {workoutWithMovements?.name || ""}:</Box>
                  {workoutWithMovements?.round ? <Box sx={{ m: 1 }}> {workoutWithMovements?.round} round(s)</Box> : <></>}
                  {workoutWithMovements?.extra_count ? (
                    <Box sx={{ m: 1 }}> {workoutWithMovements?.extra_count} extra count(s)</Box>
                  ) : (
                    <></>
                  )}
                  {workoutWithMovements?.minute ? <Box sx={{ m: 1 }}> {workoutWithMovements?.minute} minute(s)</Box> : <></>}
                  {workoutWithMovements?.extra_sec ? (
                    <Box sx={{ m: 1 }}> {workoutWithMovements?.extra_sec} extra sec(s)</Box>
                  ) : (
                    <></>
                  )}
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
                  <Box sx={{ display: "flex", alignItems: "start", flexWrap: "wrap", width: 310 }}>
                    {distinctMovements.map((movement, index) => (
                      <MovementBox key={index} id={movement.id} movement={movement} />
                    ))}
                  </Box>
                </Box>
                <Divider sx={{ mt: 1 }} />
                <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <TextareaAutosize
                    disabled={true}
                    placeholder="workout note"
                    style={{ margin: 8, flexGrow: 1, height: "100%" }}
                    minRows={3}
                    value={workoutWithMovements.note || ""}
                  />
                </Box>
              </Paper>
              {movementArr.map((movement, index) => (
                <Paper
                  key={index}
                  elevation={5}
                  sx={{ m: 1, mb: 3, p: 1, width: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  {movement.name}
                  {movement.demo_link ? (
                    <Box sx={{ height: 100, width: 125, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CardMedia
                        sx={{ flexGrow: 1, borderRadius: 2 }}
                        component="img"
                        width="100"
                        image={`https://img.youtube.com/vi/${movement.youtube_id}/0.jpg`}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", height: 100, flexBasis: "100%" }}>
                      <Box sx={{ m: 1, fontWeight: "bold" }}> Standard:</Box>
                      {workoutWithMovements?.round ? <Box sx={{ m: 1 }}> {workoutWithMovements?.round} round(s)</Box> : <></>}
                      {workoutWithMovements?.extra_count ? (
                        <Box sx={{ m: 1 }}> {workoutWithMovements?.extra_count} extra count(s)</Box>
                      ) : (
                        <></>
                      )}
                      {workoutWithMovements?.minute ? <Box sx={{ m: 1 }}> {workoutWithMovements?.minute} minute(s)</Box> : <></>}
                      {workoutWithMovements?.extra_sec ? (
                        <Box sx={{ m: 1 }}> {workoutWithMovements?.extra_sec} extra sec(s)</Box>
                      ) : (
                        <></>
                      )}
                    </Box>
                  )}
                  <Box>
                    <AnalysisBar barData={movement.barData} />
                  </Box>
                </Paper>
              ))}
            </>
          ) : (
            <></>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default Component;

function MovementBox({ id, movement }) {
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
