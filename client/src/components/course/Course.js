import { CalendarContext, AppContext } from "../../utils/reactContexts";
import { useContext, useState, useEffect } from "react";
import Functions from "./course_functions";
import { Navigate } from "react-router-dom"; // auth handler
import { Paper, Typography, Button, Divider, Box, TextField, TextareaAutosize } from "@mui/material";
import Select from "react-select";

function Component({ id }) {
  const setAlert = useContext(AppContext).setAlert;

  const calendarContext = useContext(CalendarContext);
  const courseInfo = calendarContext.arr.find((item) => item.id === id);

  const [auth, setAuth] = useState(true); // auth handler
  const [disable, setDisable] = useState(false);
  const [course, setCourse] = useState({
    id,
    start: courseInfo.start.slice(0, -6),
    end: courseInfo.end.slice(0, -6),
    title: courseInfo.title,
    size: courseInfo.size,
    note: courseInfo.note,
    point: courseInfo.point
  });
  const [selectedCoaches, setSelectedCoaches] = useState(courseInfo.coaches);
  const [selectedWorkouts, setSelectedWorkouts] = useState(courseInfo.workouts);
  const [workouts, setWorkouts] = useState([]);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    Functions.getWorkouts(setWorkouts);
    Functions.getValidCoaches(setCoaches);
  }, []);

  useEffect(() => {
    setCourse({
      ...course,
      start: courseInfo.start.slice(0, -6),
      end: courseInfo.end.slice(0, -6)
    });
  }, [courseInfo]);

  useEffect(() => {
    setCourse({
      ...course,
      coaches: selectedCoaches,
      workouts: selectedWorkouts
    });
  }, [selectedCoaches, selectedWorkouts]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Paper elevation={5} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
        <Typography sx={{ display: "inline" }} variant="h5">
          UPDATE COURSE
        </Typography>
        <Box sx={{ display: "inline-flex" }}>
          <TextField
            size="small"
            label="Start time"
            type="datetime-local"
            value={course.start}
            onChange={(e) => setCourse({ ...course, start: e.target.value })}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <TextField
            size="small"
            label="End time"
            type="datetime-local"
            value={course.end}
            onChange={(e) => setCourse({ ...course, end: e.target.value })}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <TextField
            sx={{ width: 80 }}
            type="number"
            size="small"
            label="Point"
            variant="outlined"
            value={course.point}
            onChange={(e) => setCourse({ ...course, point: e.target.value })}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <TextField
            sx={{ width: 80 }}
            type="number"
            size="small"
            label="Size"
            variant="outlined"
            value={course.size}
            onChange={(e) => setCourse({ ...course, size: e.target.value })}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 1, display: "flex" }}>
        <TextField
          sx={{ flexGrow: 1 }}
          size="small"
          label="Course title"
          variant="outlined"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Box sx={{ flexGrow: 2 }}>
          <Select
            isMulti
            value={selectedCoaches}
            onChange={setSelectedCoaches}
            options={coaches}
            placeholder={"Select coaches"}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 1 }}>
        <Select
          isMulti
          value={selectedWorkouts}
          onChange={setSelectedWorkouts}
          options={workouts}
          placeholder={"Select workouts"}
        />
      </Box>
      <Box sx={{ display: "flex", mb: 1 }}>
        <TextareaAutosize
          placeholder="course note"
          minRows={3}
          style={{ width: "100%" }}
          value={course.note}
          onChange={(e) => setCourse({ ...course, note: e.target.value })}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Button
          disabled={disable}
          sx={{ mr: 1 }}
          variant="contained"
          onClick={() => Functions.handleUpdateButton(course, calendarContext, setAuth, setDisable, setAlert)}
        >
          update
        </Button>
        <Button
          disabled={disable}
          sx={{ mr: 1 }}
          color="secondary"
          variant="contained"
          onClick={() => Functions.handleDeleteButton(id, calendarContext, setAuth, setDisable, setAlert)}
        >
          Delete
        </Button>
        <Button color="secondary" variant="contained" onClick={() => Functions.handleCancelButton(id, calendarContext)}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}

export default Component;
