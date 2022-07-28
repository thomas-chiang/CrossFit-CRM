import { useContext, useEffect, useState } from "react";
import Functions from "./personal_info_functions";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../utils/reactContexts";
import { Paper, Typography, Button, Box } from "@mui/material";

function Component() {
  const appContext = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(true);
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    Functions.getUserProfile(setUser, setAuth, appContext);
  }, []);

  if (!auth) return <Navigate to="/login" />;
  if (logout) return <Navigate to="/" />;
  if (user)
    return (
      <Box sx={{ m: 3 }}>
        <Paper elevation={5} sx={{ p: 5 }}>
          <Typography variant="h6" sx={{ m: 0.5 }}>
            Name: {user.name}
          </Typography>
          <Typography variant="h6" sx={{ m: 0.5 }}>
            Email: {user.email}
          </Typography>
          <Typography variant="h6" sx={{ m: 0.5 }}>
            Gender: {user.gender === 1 ? "Male" : "Female"}
          </Typography>
          <Typography variant="h6" sx={{ m: 0.5 }}>
            Role: {user.role === 1 ? "Member" : user.role === 2 ? "Coach" : "Gym Owner"}
          </Typography>
          <Typography variant="h6" sx={{ m: 0.5 }}>
            Validation: {user.valid === 1 ? <i style={{ color: "blue" }}>Valid</i> : <i style={{ color: "red" }}>Invalid</i>}
          </Typography>
          <Typography sx={{ margin: 0.5 }} variant="h6">
            Points avaliable: {user.point ? user.point : 0}
            <i style={{ color: "green" }}> - {user.point_to_be_deducted ? user.point_to_be_deducted : 0} (upcoming courses)</i>
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "right", marginTop: 4 }}>
            <Button
              variant="contained"
              onClick={() => {
                Functions.logout(setLogout, appContext);
              }}
            >
              Log out
            </Button>
          </Box>
        </Paper>
      </Box>
    );
}

export default Component;
