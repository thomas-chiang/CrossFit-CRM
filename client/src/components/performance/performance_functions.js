import utilsFunctions from "../../utils/functions";

const Functions = {
  updatePerformance,
  deletePerformance,
  getPerformanceWithMovementWorkoutName
};
export default Functions;

async function getPerformanceWithMovementWorkoutName(performance, setUpdatedPerformance) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `performance/movementworkoutname/${performance.id}`);
    const data = await response.json();
    if (response.ok) setUpdatedPerformance(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function deletePerformance(performance, setAuth, setUpdate, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    const token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + "performance", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // auth
      },
      body: JSON.stringify(performance)
    });
    if (response.ok) {
      setUpdate(Date());
      setAlert("Deleted successfully");
    } else {
      const data = await response.json();
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function updatePerformance(performance, setAuth, setUpdate, setDisable, setAlert) {
  setDisable(true);
  delete performance.workout_name;
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    const token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + "performance", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // auth
      },
      body: JSON.stringify(performance)
    });
    if (response.ok) {
      setUpdate(Date());
      setAlert("Updated successfully");
    } else {
      const data = await response.json();
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}
