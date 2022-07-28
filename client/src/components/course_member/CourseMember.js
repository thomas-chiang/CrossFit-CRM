import moment from "moment";
import { CalendarContext, AppContext } from "../../utils/reactContexts";
import { useContext, useState, useEffect } from "react";
import Functions from "./course_member_functions";
import { Navigate } from "react-router-dom"; // auth handler
import { Paper, Typography, Card, Button, Divider, Box, TextareaAutosize } from "@mui/material";
import CourseWorkout from "../course_workout/CourseWorkout";
import UserPoints from "../user_points/UserPoints";

function Component({ id }) {
  const setAlert = useContext(AppContext).setAlert;

  const calendarContext = useContext(CalendarContext);
  let courseInfo = calendarContext.arr.find((item) => item.id === id);

  const [auth, setAuth] = useState(true); // auth handler
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    Functions.getUser(setUser);
  }, []);

  useEffect(() => {
    courseInfo = calendarContext.arr.find((item) => item.id === id);
  }, [calendarContext.update]);

  let isExpired = new Date().getTime() > new Date(courseInfo.start).getTime();

  if (!auth) return <Navigate to="/login" />; // auth handler
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
      <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap", my: 1 }}>
        {courseInfo.workouts?.map((workout, index) => (
          <Box key={index}>
            <CourseWorkout workout={workout} />
          </Box>
        ))}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
          <TextareaAutosize
            minRows={1.9}
            disabled={true}
            placeholder="course note"
            style={{ width: "100%", height: "100%" }}
            value={courseInfo.note}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap" }}>
        {courseInfo.members?.map((member, index) => (
          <Card key={index} sx={{ p: 1, mr: 1, mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ m: 1 }} variant="subtitle1">
                {member.name}
              </Typography>
              {user?.id == member?.id ? <UserPoints member={member} /> : <></>}
            </Box>
            <Typography sx={{ m: 1 }} variant="subtitle1">
              Status:<i> {member.enrollment == 1 ? "enrolled" : member.enrollment > 1 ? "waiting" : "canceled"}</i>
            </Typography>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "right", mt: 1 }}>
        <Button
          disabled={disable || isExpired}
          sx={{ mr: 1 }}
          variant="contained"
          onClick={() => Functions.handleEnrollButton(id, calendarContext, setAuth, setDisable, setAlert)}
        >
          Enroll
        </Button>
        <Button
          disabled={disable || isExpired}
          sx={{ mr: 1 }}
          color="secondary"
          variant="contained"
          onClick={() => Functions.handleQuitButton(id, calendarContext, setAuth, setDisable, setAlert)}
        >
          Quit
        </Button>
        <Button color="secondary" variant="contained" onClick={() => Functions.handleCancelButton(id, calendarContext)}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}

export default Component;
