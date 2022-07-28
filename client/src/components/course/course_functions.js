import utilsFunctions from "../../utils/functions";

const Functions = {
  handleUpdateButton,
  handleDeleteButton,
  handleCancelButton,
  getWorkouts,
  getValidCoaches
};

export default Functions;
async function handleUpdateButton(course, calendarContext, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + "course", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // auth
      },
      body: JSON.stringify(course)
    });
    if (response.ok) {
      setAlert("Updated successfully");
      calendarContext.setUpdate(!calendarContext.update);
      let oldArr = calendarContext.arr;
      let newArr = oldArr.filter((item) => item.id !== course.id);
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

async function handleDeleteButton(id, calendarContext, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);

    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(process.env.REACT_APP_API_URL + `course?course_id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}` // auth
      }
    });
    if (response.ok) {
      setAlert("Deleted successfully");
      calendarContext.setUpdate(!calendarContext.update);
      let oldArr = calendarContext.arr;
      let newArr = oldArr.filter((item) => item.id !== id);
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

function handleCancelButton(id, calendarContext) {
  calendarContext.setUpdate(!calendarContext.update);
  let oldArr = calendarContext.arr;
  let newArr = oldArr.filter((item) => item.id !== id);
  calendarContext.setArr(newArr);
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
