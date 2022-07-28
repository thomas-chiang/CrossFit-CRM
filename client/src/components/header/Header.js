import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../utils/reactContexts";
import Functions from "./header_functions";
import { Typography, Box, List, ListItem } from "@mui/material";

function Component() {
  const appContext = useContext(AppContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    Functions.getUserProfile(setUser, appContext);
  }, [appContext.update]);

  const linkStyle = { textDecoration: "none", color: "white" };

  const location = useLocation().pathname;

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "black",
        color: "white",
        justifyContent: "space-between",
        alignItems: "center",
        height: "14vh"
      }}
    >
      <Box>
        <Link style={linkStyle} to="/">
          <Typography variant="h3" sx={{ fontWeight: "bold", textDecoration: "none", mx: 2 }}>
            CrossFit CRM
          </Typography>
        </Link>
      </Box>

      <List sx={{ display: "flex", mx: 2 }}>
        <ListItem>
          <Link style={linkStyle} to="/movement">
            MOVEMENTS
          </Link>
        </ListItem>
        <ListItem>
          <Link style={linkStyle} to="/workout">
            WORKOUTS
          </Link>
        </ListItem>
        <ListItem>
          <Link style={{ ...linkStyle, width: 160, textAlign: "center" }} to="/calendar">
            COURSE CALENDAR
          </Link>
        </ListItem>
        <ListItem>
          <Link style={linkStyle} to="/analysis">
            ANALYSIS
          </Link>
        </ListItem>
        <ListItem>
          <Link style={linkStyle} to="/leaderboard">
            LEADERBOARD
          </Link>
        </ListItem>
        {user ? (
          location != "/profile" ? (
            <ListItem>
              <Link style={linkStyle} to="/profile">
                PROFILE
              </Link>
            </ListItem>
          ) : (
            <></>
          )
        ) : (
          <ListItem>
            <Link style={linkStyle} to="/profile">
              LOGIN
            </Link>
          </ListItem>
        )}
      </List>
    </Box>
  );
}

export default Component;
