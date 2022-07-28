import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect, useContext } from "react";
import { CalendarContext, AppContext } from "../../utils/reactContexts";
import Course from "../course/Course";
import Functions from "./calendar_functions";
import { Box, Paper } from "@mui/material";

function Component() {
  const setAlert = useContext(AppContext).setAlert;

  const [update, setUpdate] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState(null);
  const [newCalendarEvent, setNewCalendarEvent] = useState(null);
  const [arr, setArr] = useState([]);

  useEffect(() => {
    Functions.getCourses(setCalendarEvents);
  }, [update]);

  function handleSelect(arg) {
    setNewCalendarEvent({
      start: arg.startStr,
      end: arg.endStr
    });
  }

  function eventSetter(arg) {
    let obj = {
      id: arg.event.id,
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

    let index = arr.findIndex((item) => item.id === arg.event.id);
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
    newCalendarEvent,
    setNewCalendarEvent,
    update,
    setUpdate,
    arr,
    setArr
  };

  return (
    <Box sx={{ m: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: "white" }}>
        <CalendarContext.Provider value={contextValue}>
          {arr.length > 0 ? arr.map((item) => <Course key={item.id} id={item.id} />) : <></>}
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
                text: "Update Course",
                click: function () {
                  setAlert("Click a bule box below and start updating the course");
                }
              }
            }}
            initialView="timeGridWeek"
            editable={true}
            events={calendarEvents}
            select={handleSelect}
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
