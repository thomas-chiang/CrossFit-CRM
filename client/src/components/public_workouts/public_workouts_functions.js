import utilsFunctions from "../../utils/functions";
const Functions = {
  createWorkout, //
  getMovementOptions, //
  getWorkoutsWithMovements //
};
export default Functions;

async function getMovementOptions(setMovements) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "movement");
    let data = await response.json();
    if (response.ok) setMovements(data);
    else alert(data.error);
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
}

async function getWorkoutsWithMovements(setWorkouts) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "workout/movement");
    let data = await response.json();
    data.reverse();
    if (response.ok) setWorkouts(data);
    else alert(data.error);
  } catch (e) {
    console.log(e);
  }
}

async function createWorkout(newWorkout, movementArr, setUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    newWorkout.movementArr = movementArr;
    const response = await fetch(process.env.REACT_APP_API_URL + "workout/movement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newWorkout)
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("created successfully");
      setUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}
