import Select from "react-select";
import Functions from "./leaderboard_functions";
import { useEffect, useState } from "react";
import { Paper, Typography, CardMedia, Button, Divider, Box, TextareaAutosize, Dialog } from "@mui/material";
import Leader from "../leader/Leader";
import Bar from "../bar/Bar";

function Component() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [leaderboards, setLeaderboards] = useState([]);
  const [distinctMovements, setDistinctMovements] = useState([]);

  useEffect(() => {
    Functions.getWorkouts(setWorkouts);
  }, []);

  const [show, setShow] = useState(false);

  // Dialog
  const [open, setOpen] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);
  const handleClickOpen = (id) => {
    setOpen(true);
    setWorkoutId(id);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [workoutWithMovements, setWorkoutWithMovements] = useState(null);
  useEffect(() => {
    Functions.getWorkout(workoutId, setWorkoutWithMovements);
    Functions.getDistinctWorkoutMovements(workoutId, setDistinctMovements);
  }, [workoutId]);

  useEffect(() => {
    if (selectedWorkouts.length > 0) Functions.getLeaderboardByWorkouts(selectedWorkouts, setLeaderboards);
    if (selectedWorkouts.length == 0) setLeaderboards([]);
    setShow(false);
  }, [selectedWorkouts]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={5}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", pt: 1 }}>
          <Typography sx={{ flexBasis: "100%", textAlign: "center", fontWeight: "bold", my: 1 }} variant="h4">
            Leaderboard
          </Typography>
          <Box sx={{ mx: 1, mb: 2, width: 800 }}>
            <Select
              isMulti
              placeholder={"Select workouts"}
              defaultValue={selectedWorkouts}
              onChange={setSelectedWorkouts}
              options={workouts}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {leaderboards.length > 0 ? (
            leaderboards.map((workout, index) => (
              <Paper elevation={5} key={index} sx={{ m: 1, mb: 3, p: 1, width: 3 / 10 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", m: 1 }}>
                  <Button variant="contained" onClick={() => handleClickOpen(workout?.id)} sx={{ textTransform: "none" }}>
                    {workout?.name} - Detailed Information
                  </Button>
                </Box>
                <Dialog
                  fullWidth
                  maxWidth={"xl"}
                  open={open && workoutId == workout?.id}
                  onClose={handleClose}
                  sx={{ display: "flex", justifyContent: "center", height: "auto" }}
                >
                  <Paper elevation={5} sx={{ p: 2, m: 2 }}>
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
                      <Box sx={{ display: "flex", alignItems: "start", flexWrap: "wrap", width: 310 }}>
                        {distinctMovements.map((movement, index) => (
                          <MovementBox key={index} id={movement.id} movement={movement} />
                        ))}
                      </Box>
                    </Box>
                    <Divider sx={{ mt: 1 }} />
                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", mt: 1 }}>
                      <TextareaAutosize
                        minRows={1.9}
                        disabled={true}
                        placeholder="workout note"
                        style={{ width: "100%" }}
                        value={workout?.note || ""}
                      />
                    </Box>
                    <Divider sx={{ mt: 1 }} />
                    {workout.leaders.length > 0 ? (
                      <Box sx={{ display: "flex" /* flexDirection: 'column' flexWrap: 'wrap', alignItems: 'center' */ }}>
                        {/* <Box sx={{mt: 1, mr: 1, width: 1}}>Top 10:</Box> */}
                        <Button
                          variant="contained"
                          onClick={() => setShow(!show)}
                          sx={{ mt: 1, mr: 1, display: "flex", height: 82, width: 95 }}
                        >
                          Top 10 Athletes
                        </Button>
                        {show ? (
                          workout.leaders.map((leader, index) => (
                            <Leader leader={leader} key={index} workoutWithMovements={workoutWithMovements} workout={workout} />
                          ))
                        ) : (
                          <></>
                        )}
                      </Box>
                    ) : (
                      <></>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                      <Button color="secondary" variant="contained" onClick={handleClose}>
                        Cancel
                      </Button>
                    </Box>
                  </Paper>
                </Dialog>

                {workout.leaders.length > 0 ? (
                  <Bar
                    barData={{
                      labels: workout.labels,
                      datasets: workout.datasets
                    }}
                  />
                ) : (
                  <></>
                )}
              </Paper>
            ))
          ) : (
            <></>
          )}
        </Box>
      </Paper>
    </Box>
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
