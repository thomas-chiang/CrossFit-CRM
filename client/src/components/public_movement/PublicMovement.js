import { useState, useEffect } from "react";
import Functions from "./public_movement_functions";
import { Box, Typography, Paper, CardMedia } from "@mui/material";

function Component() {
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    Functions.getMovements(setMovements);
  }, []);

  return (
    <Box sx={{ m: 3, mb: 0, display: "flex", alignItems: "stretch", flexWrap: "wrap" }}>
      {movements.map((movement, index) => (
        <MovementBox key={index} id={movement.id} movement={movement} />
      ))}
    </Box>
  );
}

export default Component;

function MovementBox({ id, movement }) {
  const [updateingMovement, setUpdateingMovement] = useState({
    name: movement.name,
    demo_link: movement.demo_link,
    id
  });
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setUpdateingMovement({
      name: movement.name,
      demo_link: movement.demo_link,
      id
    });
  }, [movement]);

  return (
    <Paper elevation={5} sx={{ m: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Box sx={{ mx: 1 }}>
        <Typography variant="h6">{updateingMovement.name}</Typography>
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
    </Paper>
  );
}
