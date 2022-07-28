import moment from "moment";
import { CalendarContext } from "../../utils/reactContexts";
import { useContext, useState, useEffect } from "react";
import Functions from "./course_coach_functions";
import CourseWorkoutsPerformance from "../course_workouts_performance/CourseWorkoutsPerformance";
import { Paper, Typography, Card, Button, Divider, Box, Dialog } from "@mui/material";

function Component({ id }) {
  const calendarContext = useContext(CalendarContext);
  let courseInfo = calendarContext.arr.find((item) => item.id === id);

  useEffect(() => {
    courseInfo = calendarContext.arr.find((item) => item.id === id);
  }, [calendarContext.update]);

  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const handleClickOpen = (id) => {
    setOpen(true);
    setMemberId(id);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper elevation={5} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Typography sx={{ display: "inline" }} variant="h5">
          {courseInfo.title}{" "}
        </Typography>
        <Box sx={{ display: "inline-flex" }}>
          <Typography variant="subtitle2">Coaches: </Typography>
          {courseInfo.coaches?.map((coach, index) => (
            <Typography key={index} variant="subtitle2">
              &nbsp;
              <i>
                {coach.name}
                {index !== courseInfo.coaches.length - 1 ? "," : ""}
              </i>
            </Typography>
          ))}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="subtitle2">
            Time: {moment(courseInfo.start).local().format("YYYY/MM/DD H:mm A")} -{" "}
            {moment(courseInfo.end).local().format("YYYY/MM/DD H:mm A")}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="subtitle2">
            Size:{" "}
            <i>
              {courseInfo.size_enrolled}/{courseInfo.size}
            </i>
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="subtitle2">
            Point: <i>{courseInfo.point}</i>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap" }}>
        {courseInfo.members?.map((member, index) => (
          <Card key={index} sx={{ p: 1, mr: 2, my: 1 }}>
            <Typography sx={{ m: 1 }} variant="subtitle1">
              {member.name}
            </Typography>
            <Typography sx={{ m: 1 }} variant="subtitle1">
              Status:<i> {member.enrollment == 1 ? "enrolled" : member.enrollment > 1 ? "waiting" : "canceled"}</i>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Button sx={{ my: 1 }} size="small" variant="contained" onClick={() => handleClickOpen(member.id)}>
                record
              </Button>
            </Box>
            <Dialog
              fullWidth
              maxWidth={"xl"}
              open={open && memberId == member.id}
              onClose={handleClose}
              sx={{ display: "flex", justifyContent: "center", height: "auto" }}
            >
              <Paper elevation={5} sx={{ p: 2, m: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography sx={{ display: "inline" }} variant="h5">
                    {" "}
                    {member.name}{" "}
                  </Typography>
                  <Box sx={{ display: "inline-flex" }}>
                    <Typography variant="subtitle2">{courseInfo.title} </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography variant="subtitle2">Coaches: </Typography>
                    {courseInfo.coaches?.map((coach, index) => (
                      <Typography key={index} variant="subtitle2">
                        &nbsp;
                        <i>
                          {coach.name}
                          {index !== courseInfo.coaches.length - 1 ? "," : ""}
                        </i>
                      </Typography>
                    ))}
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography variant="subtitle2">
                      Time: {moment(courseInfo.start).local().format("YYYY/MM/DD H:mm A")} -{" "}
                      {moment(courseInfo.end).local().format("YYYY/MM/DD H:mm A")}
                    </Typography>
                  </Box>
                </Box>
                <CourseWorkoutsPerformance
                  course_id={id}
                  user_id={member.id}
                  preSelectedWorkouts={courseInfo.workouts ? courseInfo.workouts : null}
                />
                <Box sx={{ display: "flex", justifyContent: "right", mt: 1 }}>
                  <Button color="secondary" variant="contained" onClick={handleClose}>
                    Cancel
                  </Button>
                </Box>
              </Paper>
            </Dialog>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Button color="secondary" variant="contained" onClick={() => Functions.handleCancelButton(id, calendarContext)}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}

export default Component;
