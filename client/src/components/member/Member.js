import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./member_functions";
import { Paper, Typography, Button, Box, TextField, Alert } from "@mui/material";
import Select from "react-select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppContext } from "../../utils/reactContexts";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff"
    }
  }
});

function Component() {
  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth
  const [members, setMembers] = useState([]);

  useEffect(() => {
    Functions.getUsersByRole(1, setMembers);
  }, [update]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Box sx={{ m: 3, display: "flex", flexWrap: "wrap", alignItems: "start", alignContent: "flex-start" }}>
      {members.map((member, index) => (
        <MemberBox key={index} member={member} setUpdate={setUpdate} setAuth={setAuth} />
      ))}
    </Box>
  );
}

export default Component;

function MemberBox({ member, setUpdate, setAuth }) {
  const [addingPoint, setAddingPoint] = useState(0);
  const [deductingPoint, setDeductingPointPoint] = useState(0);
  const [selectedRole, setSelectedRole] = useState(member);
  const [disable, setDisable] = useState(false);
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    const timeId = setTimeout(() => setAlert(null), 2000);
    return () => clearTimeout(timeId);
  }, [alert]);

  return (
    <Paper elevation={5} sx={{ p: 1, m: 1 }}>
      {alert ? (
        <Alert
          severity="info"
          variant="filled"
          sx={{
            position: "fixed",
            top: 10,
            right: 0,
            left: 0,
            mx: "auto",
            width: alert.length * 10,
            display: "flex",
            justifyContent: "center",
            backgroundColor: "gray"
          }}
        >
          {alert}
        </Alert>
      ) : (
        <></>
      )}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        {member.name}:
        <Paper elevation={3} sx={{ textAlign: "center", p: 1 }}>
          <Typography>Point(s) </Typography>
          {member.point ? member.point : 0}
          <i style={{ color: "green" }}> - {member.point_to_be_deducted ? member.point_to_be_deducted : 0}</i>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1, mx: 2 }}>
        <Box sx={{ width: 120, mr: 1, my: 2 }}>
          <Select
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            onChange={setSelectedRole}
            defaultValue={member}
            options={[
              { value: 1, label: "Member", role: 1 },
              { value: 2, label: "Coach", role: 2 },
              { value: 3, label: "Owner", role: 3 }
            ]}
          />
        </Box>

        <Button
          disabled={member.role == 3 || disable}
          sx={{ height: 38, width: 80 }}
          variant="contained"
          size="small"
          onClick={() => Functions.updateRole(member.id, selectedRole.role, setUpdate, setAuth, setDisable, setAlert)}
        >
          update
        </Button>
      </Box>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, mx: 2 }}>
          <TextField
            sx={{ width: 120, mr: 1 }}
            type="number"
            label="Point added"
            size="small"
            variant="outlined"
            value={addingPoint}
            onChange={(e) => setAddingPoint(e.target.value)}
          />

          <Button
            disabled={disable}
            color="neutral"
            sx={{ height: 40, width: 80 }}
            variant="contained"
            size="small"
            onClick={() => Functions.insertPoint(member.id, addingPoint, setUpdate, setAuth, "add", setDisable, setAlert)}
          >
            add
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, mx: 2 }}>
          <TextField
            sx={{ width: 120, mr: 1 }}
            type="number"
            label="Point deducted"
            size="small"
            variant="outlined"
            value={deductingPoint}
            onChange={(e) => setDeductingPointPoint(e.target.value)}
          />
          <Button
            disabled={disable}
            color="neutral"
            sx={{ height: 40, width: 80 }}
            variant="contained"
            size="small"
            onClick={() => Functions.insertPoint(member.id, -deductingPoint, setUpdate, setAuth, "deduct", setDisable, setAlert)}
          >
            deduct
          </Button>
        </Box>
      </ThemeProvider>
      <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
        <Button
          sx={{ mt: 1, bottom: 0 }}
          size="small"
          variant="contained"
          color={member.valid == 1 ? "secondary" : "primary"}
          onClick={() =>
            Functions.updateValidStatus(member.id, member.valid == 1 ? 0 : 1, setUpdate, setAuth, setDisable, setAlert)
          }
          disabled={member.role == 3 || disable}
        >
          {member.valid == 1 ? "invalidate" : "validate"}
        </Button>
      </Box>
    </Paper>
  );
}
