import { useState, useEffect } from "react";
import Functions from "./course_workouts_performance_functions";
import Select from "react-select";
import Performance from "../performance/Performance";
import PerformanceCreation from "../performance_creation/PerformanceCreation";
import { Paper, Typography, Box } from "@mui/material";

function Component({ course_id, user_id, preSelectedWorkouts }) {
  const [update, setUpdate] = useState(Date());
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState(preSelectedWorkouts);
  const [performances, setPerformances] = useState([]);

  useEffect(() => {
    Functions.getWorkouts(setWorkouts);
    Functions.getPerformancesByCourseUser(course_id, user_id, setPerformances);
  }, [preSelectedWorkouts, update]);

  return (
    <Box>
      <Paper elevation={5} sx={{ p: 2, my: 1 }}>
        <Select
          isMulti
          defaultValue={selectedWorkouts}
          onChange={setSelectedWorkouts}
          options={workouts}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
        {selectedWorkouts?.map((workout, index) => (
          <Paper elevation={5} key={index} sx={{ p: 1, my: 1 }}>
            <PerformanceCreation setUpdate={setUpdate} course_id={course_id} user_id={user_id} workout={workout} />
          </Paper>
        ))}
      </Paper>

      {performances.length > 0 ? (
        <Paper elevation={5} sx={{ p: 2, my: 1 }}>
          <Typography>Performances: </Typography>
          {performances.map((performance, index) => (
            <Box key={index}>
              <Performance setUpdate={setUpdate} performance={performance} />
            </Box>
          ))}
        </Paper>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Component;
