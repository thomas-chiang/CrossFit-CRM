import utilsFunctions from "../../utils/functions";
const Functions = {
  getMovements,
  createMovement,
  updateMovement,
  deleteMovement
};
export default Functions;

async function getMovements(setMovements) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "movement");
    let data = await response.json();
    data.reverse();
    if (response.ok) setMovements(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function createMovement(newMovement, setUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + "movement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newMovement)
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

async function updateMovement(updateingMovement, setUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + "movement", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateingMovement)
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("updated successfully");
      setUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function deleteMovement(id, setUpdate, setAuth, setDisable, setAlert) {
  setDisable(true);
  try {
    let token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + `movement/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("deleted successfully");
      setUpdate(Date());
    } else setAlert(data.error);
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}
