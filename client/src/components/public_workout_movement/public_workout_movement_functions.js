import utilsFunctions from "../../utils/functions";
const Functions = {
  updateWorkoutMovement,
  getWorkoutMovement,
  deleteWorkoutMovement
};
export default Functions;

async function updateWorkoutMovement(updatedMovement, setUpdate, setPassDownUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");
    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + "workout/workoutmovement", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedMovement)
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("updated successfully");
      setUpdate(Date());
      setPassDownUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    console.log(e);
    setAlert(e.message);
  }
  setDisable(false);
}

async function getWorkoutMovement(setUpdatedMovement, workout_movement_id) {
  if (!workout_movement_id) return;
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workoutmovement/${workout_movement_id}`);
    let data = await response.json();
    if (response.ok) setUpdatedMovement(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
  }
}

async function deleteWorkoutMovement(workout_movement_id, setUpdateFromChild, setPassDownUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");
    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workoutmovement/${workout_movement_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("deleted successfully");
      setPassDownUpdate(Date());
      setUpdateFromChild(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}
