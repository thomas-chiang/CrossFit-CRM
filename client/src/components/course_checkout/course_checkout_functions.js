import utilsFunctions from "../../utils/functions";

const Functions = {
  handleCancelButton,
  getCourseEnrolledmembers,
  enrollMemberByEmail,
  quitMemberById,
  checkoutMemberById,
  enrollMemberByExistingUserId,
  uncheckoutMemberById,
  removeMemberById
};
export default Functions;

async function removeMemberById(course_id, user_id, enrollment, setUpdate, setAuth, calendarContext, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);
    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(
      process.env.REACT_APP_API_URL +
        `course/removeenrollment?course_id=${course_id}&user_id=${user_id}&enrollment=${enrollment}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}` // auth
        }
      }
    );
    if (response.ok) {
      setAlert("Removed successfully");
      setUpdate(Date());
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

async function uncheckoutMemberById(course_id, user_id, enrollment, setUpdate, setAuth, calendarContext, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);
    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(
      process.env.REACT_APP_API_URL + `course/uncheck?course_id=${course_id}&user_id=${user_id}&enrollment=${enrollment}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}` // auth
        }
      }
    );
    if (response.ok) {
      setAlert("Unchecked successfully");
      setUpdate(Date());
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

async function checkoutMemberById(course_id, user_id, enrollment, setUpdate, setAuth, calendarContext, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);
    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(
      process.env.REACT_APP_API_URL + `course/checkout/?course_id=${course_id}&user_id=${user_id}&enrollment=${enrollment}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}` // auth
        }
      }
    );
    if (response.ok) {
      setAlert("Checked out successfully");
      setUpdate(Date());
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

async function quitMemberById(course_id, user_id, enrollment, setUpdate, setAuth, calendarContext, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);
    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(
      process.env.REACT_APP_API_URL +
        `course/enrollmentbycoach/?course_id=${course_id}&user_id=${user_id}&enrollment=${enrollment}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}` // auth
        }
      }
    );
    if (response.ok) {
      setAlert("Quit successfully");
      setUpdate(Date());
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

async function enrollMemberByEmail(course_id, email, setUpdate, setAuth, calendarContext, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);
    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(
      process.env.REACT_APP_API_URL + `course/enrollmentbycoach/?course_id=${course_id}&email=${email}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // auth
        }
      }
    );
    if (response.ok) {
      setAlert("Enrolled successfully");
      setUpdate(Date());
      calendarContext.setUpdate(!calendarContext.update);
    } else {
      let data = await response.json();
      setUpdate(Date());
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function enrollMemberByExistingUserId(course_id, user_id, setUpdate, setAuth, calendarContext, setDisable, setAlert) {
  setDisable(true);
  try {
    if (!(await utilsFunctions.auth())) return setAuth(false);
    let token = localStorage.getItem("jwtToken"); // auth
    const response = await fetch(
      //process.env.REACT_APP_API_URL + `course/enrollmentbycoach/existinguser/?course_id=${course_id}&user_id=${user_id}`,
      process.env.REACT_APP_API_URL + `course/enrollmentbycoach/${user_id}?course_id=${course_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // auth
        }
      }
    );
    if (response.ok) {
      setAlert("Enrolled successfully");
      setUpdate(Date());
      calendarContext.setUpdate(!calendarContext.update);
    } else {
      let data = await response.json();
      setUpdate(Date());
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function getCourseEnrolledmembers(course_id, setMembers) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `course/enrolled/${course_id}`);
    let data = await response.json();
    if (response.ok) {
      setMembers(data);
    } else {
      alert(data.error);
    }
  } catch (e) {
    console.log(e.message);
  }
}

function handleCancelButton(id, calendarContext) {
  calendarContext.setUpdate(!calendarContext.update);
  let oldArr = calendarContext.arr;
  let newArr = oldArr.filter((item) => item.id !== id);
  calendarContext.setArr(newArr);
}
