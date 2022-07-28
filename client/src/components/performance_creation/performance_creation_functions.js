import utilsFunctions from "../../utils/functions";
const Functions = {
  getWorkoutMovements,
  createPerformance
};
export default Functions;

async function getWorkoutMovements(workout_id, setMovements) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workoutmovements/${workout_id}`);
    let data = await response.json();
    if (response.ok) setMovements(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function createPerformance(performance, setAuth, setUpdate, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + "performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // auth
      },
      body: JSON.stringify(performance)
    });
    if (response.ok) {
      setUpdate(Date());
      setAlert("created successfully");
    } else {
      let data = await response.json();
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}
