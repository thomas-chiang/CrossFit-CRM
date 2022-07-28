import utilsFunctions from "../../utils/functions";
const Functions = {
  handleCreateButton,
  cancel,
  getWorkouts,
  getValidCoaches
};
export default Functions;

async function handleCreateButton(course, courseFromCalendar, calendarContext, setAuth, setDisable, setAlert) {
  setDisable(true);
  delete course.id;
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + "course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // auth
      },
      body: JSON.stringify(course)
    });

    if (response.ok) {
      setAlert("created successfully");
      calendarContext.setUpdate(!calendarContext.update);
      let oldArr = calendarContext.arr;
      let newArr = oldArr.filter((item) => item.id !== courseFromCalendar.id);
      calendarContext.setArr(newArr);
    } else {
      let data = await response.json();
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function getWorkouts(setWorkouts) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "workout/");
    let data = await response.json();
    if (response.ok) setWorkouts(data);
    else alert(data.error);
  } catch (e) {
    console.log(e);
  }
}

async function getValidCoaches(setCoaches) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "user/validcoaches");
    let data = await response.json();
    if (response.ok) setCoaches(data);
    else alert(data.error);
  } catch (e) {
    console.log(e);
  }
}

function cancel(id, calendarContext) {
  calendarContext.setUpdate(!calendarContext.update);
  let oldArr = calendarContext.arr;
  let newArr = oldArr.filter((item) => item.id !== id);
  calendarContext.setArr(newArr);

  calendarContext.obj[id] = null;
  calendarContext.setObj(calendarContext.obj);
}
