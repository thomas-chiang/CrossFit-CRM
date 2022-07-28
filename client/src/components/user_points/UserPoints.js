import { useState, useEffect } from "react";
import Functions from "./user_points_functions";
import { Paper, Typography } from "@mui/material";

function Component({ member, update }) {
  const [points, setPoints] = useState(null);

  useEffect(() => {
    Functions.getSumPointsByUser(member.id, setPoints);
  }, [member, update]);

  return (
    <Paper elevation={3} sx={{ textAlign: "center", p: 1 }}>
      <Typography>Point(s) </Typography>
      {points?.point ? points.point : 0}
      <i style={{ color: "green" }}> - {points?.point_to_be_deducted ? points.point_to_be_deducted : 0}</i>
    </Paper>
  );
}

export default Component;
