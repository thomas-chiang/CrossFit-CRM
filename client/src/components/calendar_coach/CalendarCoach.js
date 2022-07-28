import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect, useContext } from "react";
import { CalendarContext, AppContext } from "../../utils/reactContexts";
import Course_coach from "../course_coach/CourseCoach";
import Functions from "./calender_coach_functions";
import { Box, Paper } from "@mui/material";

function Component() {
  const setAlert = useContext(AppContext).setAlert;

  const [update, setUpdate] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState(null);
  const [arr, setArr] = useState([]);

  useEffect(() => {
    Functions.getCourses(setCalendarEvents);
  }, [update]);

  useEffect(() => {
    Functions.updateArr(calendarEvents, arr, setArr);
  }, [calendarEvents]);

  function eventSetter(arg) {
    let obj = {
      id: parseInt(arg.event.id),
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr,
      size: arg.event.extendedProps.size,
      note: arg.event.extendedProps.note,
      coaches: arg.event.extendedProps.coaches,
      members: arg.event.extendedProps.members,
      workouts: arg.event.extendedProps.workouts,
      gym_id: arg.event.extendedProps.gym_id,
      gym_name: arg.event.extendedProps.gym_name,
      gym: arg.event.extendedProps.gym,
      size_enrolled: arg.event.extendedProps.size_enrolled,
      point: arg.event.extendedProps.point
    };
    let index = arr.findIndex((item) => item.id == arg.event.id);
    if (index !== -1) {
      arr[index] = obj;
      setArr([...arr]); //must deep copy
    } else setArr([...arr, obj]);
  }

  function renderEventContent(arg) {
    return (
      <div>
        <div>
          {arg.event.extendedProps.size_enrolled}/{arg.event.extendedProps.size}: {arg.event.title}
        </div>
      </div>
    );
  }

  const contextValue = {
    update,
    setUpdate,
    arr,
    setArr
  };

  return (
    <Box sx={{ m: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: "white" }}>
        <CalendarContext.Provider value={contextValue}>
          {arr.length > 0 ? arr.map((item, index) => <Course_coach key={index} id={item.id} />) : <></>}
          <FullCalendar
            dayMaxEventRows={5}
            eventMaxStack={5}
            slotDuration="01:00"
            navLinks={true}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev next today",
              center: "customButton",
              right: "timeGridDay timeGridWeek dayGridMonth"
            }}
            customButtons={{
              customButton: {
                text: "Record Performance",
                click: function () {
                  setAlert("Click a course below and start recording members' performances");
                }
              }
            }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            events={calendarEvents}
            eventClick={eventSetter}
            eventContent={renderEventContent}
            eventDrop={eventSetter}
            eventResize={eventSetter}
            allDaySlot={false}
            eventDisplay={"block"}
            height={"auto"}
          />
        </CalendarContext.Provider>
      </Paper>
    </Box>
  );
}

export default Component;
