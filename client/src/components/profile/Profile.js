import "react-pro-sidebar/dist/css/styles.css";
import PersonalInfo from "../personal_info/PersonalInfo";
import Sidebar from "../sidebar/Sidebar";
import Calendar from "../calendar/Calendar";
import CalendarCoach from "../calendar_coach/CalendarCoach";
import Movement from "../movement/Movement";
import Workout from "../workout/Workout";
import CalendarCheckout from "../calendar_checkout/CalendarCheckout";
import CalendarCreation from "../calendar_creation/CalendarCreation";
import Member from "../member/Member";
import Points from "../points/Points";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Functions from "./profile_functions";

function Component() {
  const [section, setSection] = useState("personal info");
  const [role, setRole] = useState(1);

  useEffect(() => {
    Functions.getRole(setRole);
  });

  return (
    <Box sx={{ display: "flex", position: "sticky", minHeight: "86vh" }}>
      <Box>
        <Sidebar setSection={setSection} role={role} />
      </Box>
      {section === "personal info" ? <PersonalInfo /> : <></>}
      {section === "points" ? <Points role={role} /> : <></>}
      {section === "movement" ? <Movement /> : <></>}
      {section === "workout" ? <Workout /> : <></>}
      {section === "member" ? <Member /> : <></>}
      {section === "calendar" ? <Calendar /> : <></>}
      {section === "performance" ? <CalendarCoach /> : <></>}
      {section === "enroll and checkout" ? <CalendarCheckout role={role} /> : <></>}
      {section === "create course" ? <CalendarCreation /> : <></>}
    </Box>
  );
}

export default Component;
