import moment from "moment";
import { CalendarContext, AppContext } from "../../utils/reactContexts";
import { useContext, useState, useEffect } from "react";
import Functions from "./course_checkout_functions";
import { Navigate } from "react-router-dom"; // auth handler
import { Paper, Typography, Card, Button, Divider, Box, TextField } from "@mui/material";
import UserPoints from "../user_points/UserPoints";

function Component({ id, role }) {
  const setAlert = useContext(AppContext).setAlert;

  const calendarContext = useContext(CalendarContext);
  let courseInfo = calendarContext.arr.find((item) => item.id === id);

  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth handler
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    courseInfo = calendarContext.arr.find((item) => item.id === id);
  }, [calendarContext.update]);

  useEffect(() => {
    Functions.getCourseEnrolledmembers(id, setMembers);
  }, [update, calendarContext.update]);

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
      <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap" }}>
        {members.map((member, index) => (
          <Card key={index} sx={{ p: 1, mr: 2, my: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ m: 1 }} variant="subtitle1">
                {member.name}
              </Typography>
              <UserPoints member={member} update={update} />
            </Box>
            <Typography sx={{ m: 1 }} variant="subtitle1">
              Status: <i>{member.enrollment == 1 ? "enrolled" : member.enrollment > 1 ? "waiting" : "canceled"}</i>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              {member.checkout === 0 ? (
                <>
                  {member.enrollment == 1 ? (
                    <>
                      {role >= 3 ? (
                        <Button
                          disabled={disable}
                          sx={{ m: 1 }}
                          size="small"
                          variant="contained"
                          onClick={() => {
                            Functions.checkoutMemberById(
                              id,
                              member.id,
                              member.enrollment,
                              setUpdate,
                              setAuth,
                              calendarContext,
                              setDisable,
                              setAlert
                            );
                          }}
                        >
                          checkout
                        </Button>
                      ) : (
                        <></>
                      )}
                      <Button
                        disabled={disable}
                        sx={{ my: 1 }}
                        size="small"
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                          Functions.quitMemberById(
                            id,
                            member.id,
                            member.enrollment,
                            setUpdate,
                            setAuth,
                            calendarContext,
                            setDisable,
                            setAlert
                          );
                        }}
                      >
                        quit
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        disabled={disable}
                        sx={{ my: 1, bottom: 0 }}
                        size="small"
                        variant="contained"
                        onClick={() => {
                          Functions.enrollMemberByExistingUserId(
                            id,
                            member.id,
                            setUpdate,
                            setAuth,
                            calendarContext,
                            setDisable,
                            setAlert
                          );
                        }}
                      >
                        enroll
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {role >= 3 ? (
                    <Button
                      disabled={disable}
                      sx={{ m: 1 }}
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        Functions.uncheckoutMemberById(
                          id,
                          member.id,
                          member.enrollment,
                          setUpdate,
                          setAuth,
                          calendarContext,
                          setDisable,
                          setAlert
                        );
                      }}
                    >
                      uncheck
                    </Button>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {role >= 3 ? (
                <Button
                  disabled={disable}
                  sx={{ ml: 1, my: 1 }}
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    Functions.removeMemberById(
                      id,
                      member.id,
                      member.enrollment,
                      setUpdate,
                      setAuth,
                      calendarContext,
                      setDisable,
                      setAlert
                    );
                  }}
                >
                  remove
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </Card>
        ))}
        <Card sx={{ p: 1, mr: 2, my: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <TextField
            size="small"
            type="email"
            label="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Button
              disabled={disable}
              sx={{ my: 1, bottom: 0 }}
              size="small"
              variant="contained"
              onClick={() => {
                Functions.enrollMemberByEmail(id, email, setUpdate, setAuth, calendarContext, setDisable, setAlert);
              }}
            >
              enroll
            </Button>
          </Box>
        </Card>
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
