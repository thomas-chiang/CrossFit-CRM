import utilsFunctions from "../../utils/functions";
const Functions = {
  getUsersByRole,
  updateValidStatus,
  insertPoint,
  updateRole
};
export default Functions;

async function getUsersByRole(role_level, setCoaches) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `user/role/${role_level}`);
    let data = await response.json();
    if (response.ok) setCoaches(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function updateValidStatus(user_id, valid_status, setUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + `user/valid?user_id=${user_id}&valid_status=${valid_status}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("updated valid status successfully");
      setUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function updateRole(user_id, role, setUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + `user/role?user_id=${user_id}&role=${role}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("updated role successfully");
      setUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function insertPoint(user_id, point, setUpdate, setAuth, behavior, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(
      process.env.REACT_APP_API_URL + `user/point?user_id=${user_id}&point=${point}&behavior=${behavior}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    let data = await response.json();
    if (response.ok) {
      if (point > 0) setAlert("added point successfully");
      if (point < 0) setAlert("deducted point successfully");
      setUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}
