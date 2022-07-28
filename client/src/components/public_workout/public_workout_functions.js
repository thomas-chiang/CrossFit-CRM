import utilsFunctions from "../../utils/functions";
const Functions = {
  getWorkout,
  addWorkoutMovement,
  updateOnlyWorkout,
  deleteWorkout,
  getDistinctWorkoutMovements
};
export default Functions;

async function getDistinctWorkoutMovements(workout_id, setWorkoutMovements) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/distinctworkoutmovements/${workout_id}`);
    let data = await response.json();

    for (let item of data) {
      item.label = item.name;
      item.value = item.name;
    }

    if (response.ok) setWorkoutMovements(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function deleteWorkout(workout_id, setAuth, setPassDownUpdate, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");
    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workout/${workout_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("deleted successfully");
      setPassDownUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    console.log(e);
    setAlert(e.message);
  }
  setDisable(false);
}

async function getWorkout(workout_id, setUpdatedWorkout) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workout/${workout_id}`);
    let data = await response.json();
    if (response.ok) setUpdatedWorkout(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
    //alert(e.message)
  }
}

async function addWorkoutMovement(newWorkoutMovement, setAuth, setUpdate, setPassDownUpdate, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");
    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + "workout/addmovement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newWorkoutMovement)
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("added successfully");
      setUpdate(Date());
      setPassDownUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    console.log(e);
    setAlert(e.message);
  }
  setDisable(false);
}

async function updateOnlyWorkout(updatedWorkout, setAuth, setUpdate, setPassDownUpdate, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");
    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + "workout/onlyworkout", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedWorkout)
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
