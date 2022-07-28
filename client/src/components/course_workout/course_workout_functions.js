import utilsFunctions from "../../utils/functions";

const Functions = {
  handleEnrollButton,
  handleQuitButton,
  handleCancelButton,
  getWorkout,
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

async function handleEnrollButton(id, calendarContext, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + `course/enrollment/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}` // auth
      }
    });
    if (response.ok) {
      setAlert("Enrolled successfully");
      calendarContext.setUpdate(!calendarContext.update);
    } else {
      let data = await response.json();
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function handleQuitButton(id, calendarContext, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + `course/enrollment/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}` // auth
      }
    });
    if (response.ok) {
      setAlert("Quit successfully");
      calendarContext.setUpdate(!calendarContext.update);
    } else {
      let data = await response.json();
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

function handleCancelButton(id, calendarContext) {
  calendarContext.setUpdate(!calendarContext.update);
  let oldArr = calendarContext.arr;
  let newArr = oldArr.filter((item) => item.id !== id);
  calendarContext.setArr(newArr);
}

async function getWorkout(workout_id, setUpdatedWorkout) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workout/${workout_id}`);
    let data = await response.json();
    if (response.ok) setUpdatedWorkout(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
  }
}
