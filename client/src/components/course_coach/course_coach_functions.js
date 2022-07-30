import utilsFunctions from "../../utils/functions";

const Functions = {
  handleEnrollButton,
  handleQuitButton,
  handleCancelButton
};
export default Functions;

async function handleEnrollButton(id, calendarContext, setAuth) {
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
      alert("Enrolled successfully");
      calendarContext.setUpdate(!calendarContext.update);
    } else {
      let data = await response.json();
      alert(data.error);
    }
  } catch (e) {
    alert(e.message);
  }
}

async function handleQuitButton(id, calendarContext, setAuth) {
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
      alert("Quit successfully");
      calendarContext.setUpdate(!calendarContext.update);
    } else {
      let data = await response.json();
      alert(data.error);
    }
  } catch (e) {
    alert(e.message);
  }
}

function handleCancelButton(id, calendarContext) {
  calendarContext.setUpdate(!calendarContext.update);
  let oldArr = calendarContext.arr;
  let newArr = oldArr.filter((item) => item.id !== id);
  calendarContext.setArr(newArr);
}
