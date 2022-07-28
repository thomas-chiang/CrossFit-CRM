import utilsFunctions from "../../utils/functions";
const Functions = {
  getUsersByRole,
  getUser,
  getPointsByUser,
  deletePointById
};
export default Functions;

async function deletePointById(id, setUpdate, setAuth, setDisable, setAlert) {
  //console.log(id)
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + `user/point/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("deleted point successfully");
      setUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function getPointsByUser(user_id, setPoints) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `user/point/${user_id}`);
    let data = await response.json();
    if (response.ok) setPoints(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function getUsersByRole(role_level, setCoaches) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `user/role/${role_level}`);
    let data = await response.json();

    for (let user of data) {
      user.value = user.id;
      user.label = user.name;
    }

    if (response.ok) setCoaches(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function getUser(setUser) {
  try {
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + "token", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
    if (response.ok) {
      data.value = data.id;
      data.label = data.name;
      setUser(data);
    } else {
      console.log(data.error);
      localStorage.removeItem("jwtToken");
    }
  } catch (e) {
    console.log(e.message);
  }
}
