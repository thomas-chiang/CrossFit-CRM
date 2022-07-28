import Select from "react-select";
import Functions from "./points_functions";
import { useEffect, useState, useContext } from "react";
import { Paper, Box } from "@mui/material";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Navigate } from "react-router-dom"; // auth handler
import { AppContext } from "../../utils/reactContexts";

function Component({ role }) {
  const setAlert = useContext(AppContext).setAlert;
  const [disable, setDisable] = useState(false);
  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth
  const [points, setPoints] = useState([]);
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    Functions.getUser(setUser);
    Functions.getUsersByRole(1, setMembers);
  }, []);

  useEffect(() => {
    if (user) setSelectedMember(user);
  }, [user]);

  useEffect(() => {
    if (selectedMember) Functions.getPointsByUser(selectedMember.id, setPoints);
  }, [selectedMember, update]);

  const columns = [
    { field: "point_modifier", headerName: "User", width: 120 },
    { field: "role", headerName: "Role", width: 80 },
    { field: "time", headerName: "Time", type: "dateTime", width: 200 },
    { field: "point", headerName: "Point (+/-)", width: 100, type: "number" },
    { field: "unchecked_point", headerName: "Point for upcoming courses (+/-)", width: 250, type: "number" },
    { field: "course_title", headerName: "Course Title", width: 200 },
    { field: "course_time", headerName: "Course Time", width: 200 }
  ];

  const gymOwnerColumns = [
    ...columns,
    {
      field: "actions",
      headerName: "Delete",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => Functions.deletePointById(params.id, setUpdate, setAuth, setDisable, setAlert)}
          disabled={disable}
        />
      ]
    }
  ];

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Paper elevation={5} sx={{ m: 3, display: "flex", alignItems: "stretch", width: "100%" }}>
      <Box sx={{ pb: role == 3 ? 8 : 2, width: "100%" }}>
        {role == 3 ? (
          <Box sx={{ m: 1 }}>
            <Select placeholder={"Select user"} value={selectedMember} onChange={setSelectedMember} options={members} />
          </Box>
        ) : (
          <></>
        )}

        <DataGrid
          rows={points}
          columns={role == 3 ? gymOwnerColumns : columns}
          sx={{ m: 1 }}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Paper>
  );
}

export default Component;
