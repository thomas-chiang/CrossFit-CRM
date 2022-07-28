import { Grid, Typography, Button, Box, Paper, CardMedia, Card } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Component() {
  const [profile, setProfile] = useState(false);
  const [change, setChange] = useState(false);
  const [loop, setLoop] = useState();

  useEffect(() => {
    setLoop(
      setInterval(() => {
        setChange(!change);
      }, 2000)
    );

    return function cleanup() {
      clearInterval(loop);
    };
  }, [change]);

  let typographyStyle = {
    textAlign: "center",
    p: 1,
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  let cardStyle = {
    position: "relative",
    backgroundColor: "rgb(40,40,40)",
    color: "white",
    height: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "start"
  };

  if (profile) return <Navigate to="/profile" />;
  return (
    <Box>
      <Grid container spacing={1} sx={{ mt: 8, mb: 10 }}>
        <Grid item md={1}></Grid>
        <Grid item md={10}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h3" fontWeight={700}>
                Let's Run Your CrossFit Gym!
              </Typography>
              <Button variant="contained" sx={{ fontSize: "16px" }} onClick={() => setProfile(true)}>
                Start
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">
                A well-rounded gym system including{" "}
                <b>
                  <i>membership administration</i>
                </b>
                ,{" "}
                <b>
                  <i>workout customization</i>
                </b>
                ,{" "}
                <b>
                  <i>performance analysis</i>
                </b>
                , and{" "}
                <b>
                  <i>course management</i>
                </b>
                .
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item md={1}></Grid>
      </Grid>

      <Grid container spacing={6} sx={{ display: "flex", alignItems: "stretch" }}>
        <Grid item md={1}></Grid>
        <Grid item md={2}>
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              height="140"
              image={require("./role_point1.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 1 : 0 }}
            />
            <CardMedia
              component="img"
              height="140"
              image={require("./role_point2.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 0 : 1 }}
            />
            <CardMedia component="img" height="140" />
            <Typography variant="h6" sx={typographyStyle}>
              <b>Manage Users & Points</b>
            </Typography>
          </Card>
        </Grid>

        <Grid item md={2}>
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              height="140"
              image={require("./workout1.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 1 : 0 }}
            />
            <CardMedia
              component="img"
              height="140"
              image={require("./workout2.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 0 : 1 }}
            />
            <CardMedia component="img" height="140" />
            <Typography variant="h6" sx={typographyStyle}>
              <b>Design Workouts</b>
            </Typography>
          </Card>
        </Grid>

        <Grid item md={2}>
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              height="140"
              image={require("./course1.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 1 : 0 }}
            />
            <CardMedia
              component="img"
              height="140"
              image={require("./course2.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 0 : 1 }}
            />
            <CardMedia component="img" height="140" />
            <Typography variant="h6" sx={typographyStyle}>
              <b>Create & Enroll Courses</b>
            </Typography>
          </Card>
        </Grid>

        <Grid item md={2}>
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              height="140"
              image={require("./check_record1.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 1 : 0 }}
            />
            <CardMedia
              component="img"
              height="140"
              image={require("./check_record2.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 0 : 1 }}
            />
            <CardMedia component="img" height="140" />
            <Typography variant="h6" sx={typographyStyle}>
              <b>Checkout Points & Record Results</b>
            </Typography>
          </Card>
        </Grid>

        <Grid item md={2}>
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              height="140"
              image={require("./analyze_compete1.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 1 : 0 }}
            />
            <CardMedia
              component="img"
              height="140"
              image={require("./analyze_compete2.jpeg")}
              sx={{ transition: "opacity 2s", position: "absolute", top: 0, opacity: change ? 0 : 1 }}
            />
            <CardMedia component="img" height="140" />
            <Typography variant="h6" sx={typographyStyle}>
              <b>Compete & Analyze</b>
            </Typography>
          </Card>
        </Grid>
        <Grid item md={0.5}></Grid>
      </Grid>
    </Box>
  );
}

export default Component;
