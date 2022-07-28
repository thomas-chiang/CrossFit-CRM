import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom"; // auth handler
import Functions from "./movement_functions";
import { Button, Box, TextField, Paper, CardMedia } from "@mui/material";
import { AppContext } from "../../utils/reactContexts";

function Component() {
  const setAlert = useContext(AppContext).setAlert;
  const [update, setUpdate] = useState(Date());
  const [auth, setAuth] = useState(true); // auth
  const [movements, setMovements] = useState([]);
  const [newMovement, setNewMovement] = useState({
    name: "",
    demo_link: ""
  });
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    Functions.getMovements(setMovements);
  }, [update]);

  if (!auth) return <Navigate to="/login" />; // auth handler
  return (
    <Box sx={{ m: 3, display: "flex", alignItems: "stretch", flexWrap: "wrap" }}>
      <Paper elevation={5} sx={{ m: 1, pt: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <TextField
            size="small"
            label="Movement name"
            variant="outlined"
            value={newMovement.name}
            sx={{ m: 1, flexBasis: "100%" }}
            onChange={(e) => setNewMovement({ ...newMovement, name: e.target.value })}
          />
        </Box>
        <Box sx={{ display: "flex" }}>
          <TextField
            size="small"
            label="Youtube link"
            variant="outlined"
            value={newMovement.demo_link}
            sx={{ m: 1, flexBasis: "100%" }}
            onChange={(e) => setNewMovement({ ...newMovement, demo_link: e.target.value })}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "right", flexBasis: "100%", alignItems: "end", mt: 1 }}>
          <Button
            disabled={disable}
            sx={{ m: 1, bottom: 0 }}
            size="small"
            variant="contained"
            onClick={() => {
              Functions.createMovement(newMovement, setUpdate, setAuth, setDisable, setAlert);
            }}
          >
            create
          </Button>
        </Box>
      </Paper>
      {movements.map((movement, index) => (
        <MovementBox key={index} id={movement.id} movement={movement} setUpdate={setUpdate} setAuth={setAuth} />
      ))}
    </Box>
  );
}

export default Component;

function MovementBox({ id, movement, setUpdate, setAuth }) {
  const setAlert = useContext(AppContext).setAlert;
  const [updateingMovement, setUpdateingMovement] = useState({
    name: movement.name,
    demo_link: movement.demo_link,
    id
  });
  const [disable, setDisable] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setUpdateingMovement({
      name: movement.name,
      demo_link: movement.demo_link,
      id
    });
  }, [movement]);

  return (
    <Paper elevation={5} sx={{ m: 1, pt: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex" }}>
        <TextField
          size="small"
          label="Movement name"
          variant="outlined"
          value={updateingMovement.name}
          sx={{ m: 1, flexBasis: "100%" }}
          onChange={(e) => setUpdateingMovement({ ...updateingMovement, name: e.target.value })}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          size="small"
          label="Youtube link"
          variant="outlined"
          value={updateingMovement.demo_link}
          sx={{ m: 1, flexBasis: "100%" }}
          onChange={(e) => setUpdateingMovement({ ...updateingMovement, demo_link: e.target.value })}
        />
      </Box>
      {movement.demo_link ? (
        <Box sx={{ flexBasis: "100%" }}>
          {play ? (
            <iframe
              title={movement.demo_link}
              frameBorder="0"
              src={`${movement.embed_link}?autoplay=1&mute=1&showinfo=0&modestbranding=1&rel=0`}
              allow="autoplay"
              muted
              style={{ height: 140 }}
            />
          ) : (
            <CardMedia
              sx={{ cursor: "pointer" }}
              onClick={() => setPlay(true)}
              component="img"
              height="140"
              image={`https://img.youtube.com/vi/${movement.youtube_id}/0.jpg`}
            />
          )}
        </Box>
      ) : (
        <></>
      )}
      <Box sx={{ display: "flex", justifyContent: "right", flexBasis: "100%", alignItems: "end", mt: 1 }}>
        <Button
          disabled={disable}
          sx={{ mr: 1, mb: 1, bottom: 0 }}
          size="small"
          variant="contained"
          onClick={() => Functions.updateMovement(updateingMovement, setUpdate, setAuth, setDisable, setAlert)}
        >
          update
        </Button>
        <Button
          disabled={disable}
          sx={{ mr: 1, mb: 1, bottom: 0 }}
          size="small"
          variant="contained"
          onClick={() => Functions.deleteMovement(id, setUpdate, setAuth, setDisable, setAlert)}
          color="secondary"
        >
          delete
        </Button>
      </Box>
    </Paper>
  );
}
