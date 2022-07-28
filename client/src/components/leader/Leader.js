import { useEffect, useState } from "react";
import Functions from "./leader_functions";
import { Paper, Typography, Card, Button, Divider, Box, TextField, TextareaAutosize, Dialog } from "@mui/material";
import moment from "moment";

function Component({ leader, workoutWithMovements, workout }) {
  const [performances, setPerformances] = useState(null);

  useEffect(() => {
    Functions.getLeader(leader, setPerformances, workoutWithMovements?.movements);
  }, []);

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

  if (performances)
    return (
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 1,
          mr: 1
        }}
      >
        <Box sx={{ m: 1 }}>{performances[0]?.user_name}</Box>
        <Box sx={{ m: 1 }}>
          <Button variant="contained" size="small" onClick={() => handleClickOpen(performances[0].id)}>
            {leader.score.toFixed(2)}
          </Button>
        </Box>
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={open && workoutId == performances[0].id}
          onClose={handleClose}
          sx={{ display: "flex", justifyContent: "center", height: "auto" }}
        >
          <Paper elevation={5} sx={{ p: 2, m: 2, mb: 0, display: "flex", justifyContent: "center" }}>
            <Typography variant="subtitle2">
              Time: {moment(performances[0].start).local().format("YYYY/MM/DD H:mm A")} -{" "}
              {moment(performances[0].end).local().format("YYYY/MM/DD H:mm A")}
            </Typography>
          </Paper>
          <Box sx={{ display: "flex" }}>
            <Paper elevation={5} sx={{ p: 2, m: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ m: 1, fontWeight: "bold" }}> {workout.name || ""}:</Box>
                {workout.round ? <Box sx={{ m: 1 }}> {workout.round} round(s)</Box> : <></>}
                {workout.extra_count ? <Box sx={{ m: 1 }}> {workout.extra_count} extra count(s)</Box> : <></>}
                {workout.minute ? <Box sx={{ m: 1 }}> {workout.minute} minute(s)</Box> : <></>}
                {workout.extra_sec ? <Box sx={{ m: 1 }}> {workout.extra_sec} extra sec(s)</Box> : <></>}
              </Box>
              <Divider sx={{ mt: 1 }} />
              {workoutWithMovements?.movements.map((movement, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "stretch" }}>
                  <Box sx={{ m: 1, width: 150, textAlign: "end" }}>{movement.name}:</Box>
                  {movement?.kg ? <Box sx={{ m: 1 }}>{movement?.kg} kg(s)</Box> : <></>}
                  {movement?.rep ? <Box sx={{ m: 1 }}>{movement?.rep} rep(s)</Box> : <></>}
                  {movement?.meter ? <Box sx={{ m: 1 }}>{movement?.meter} meter(s)</Box> : <></>}
                  {movement?.cal ? <Box sx={{ m: 1 }}>{movement?.cal} cal(s)</Box> : <></>}
                </Box>
              ))}
            </Paper>
            <Paper elevation={5} sx={{ p: 2, m: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ m: 1, fontWeight: "bold", color: "#2196f3" }}> {performances[0]?.user_name || ""}:</Box>
                {performances[0]?.round ? (
                  <Box sx={{ m: 1, color: performances[0]?.round > workout.round ? "#2196f3" : "black" }}>
                    {" "}
                    {performances[0]?.round} round(s)
                  </Box>
                ) : (
                  <></>
                )}
                {performances[0]?.extra_count ? (
                  <Box sx={{ m: 1, color: performances[0]?.extra_count == workout.extra_count ? "#2196f3" : "black" }}>
                    {" "}
                    {performances[0]?.extra_count} extra count(s)
                  </Box>
                ) : (
                  <></>
                )}
                {performances[0]?.minute ? (
                  <Box sx={{ m: 1, color: performances[0]?.minute < workout.minute ? "#2196f3" : "black" }}>
                    {" "}
                    {performances[0]?.minute} minute(s)
                  </Box>
                ) : (
                  <></>
                )}
                {performances[0]?.extra_sec ? (
                  <Box sx={{ m: 1, color: performances[0]?.minute < workout.minute ? "#2196f3" : "black" }}>
                    {" "}
                    {performances[0]?.extra_sec} extra sec(s)
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
              <Divider sx={{ mt: 1 }} />
              {performances?.map((performance, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "stretch" }}>
                  <Box sx={{ m: 1, width: 150, textAlign: "end" }}>{performance.movement_name}:</Box>
                  {performance.kg ? (
                    <Box sx={{ m: 1, color: performance.kg > performance.original_kg ? "#2196f3" : "black" }}>
                      {performance.kg} kg(s)
                    </Box>
                  ) : (
                    <></>
                  )}
                  {performance.rep ? (
                    <Box sx={{ m: 1, color: performance.rep > performance.original_rep ? "#2196f3" : "black" }}>
                      {performance.rep} rep(s)
                    </Box>
                  ) : (
                    <></>
                  )}
                  {performance.meter ? (
                    <Box sx={{ m: 1, color: performance.meter > performance.original_meter ? "#2196f3" : "black" }}>
                      {performance.meter} meter(s)
                    </Box>
                  ) : (
                    <></>
                  )}
                  {performance.cal ? (
                    <Box sx={{ m: 1, color: performance.cal > performance.original_cal ? "#2196f3" : "black" }}>
                      {performance.cal} cal(s)
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              ))}
            </Paper>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "right", mr: 2, mb: 2 }}>
            <Button color="secondary" variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Dialog>
      </Paper>
    );
}

export default Component;
