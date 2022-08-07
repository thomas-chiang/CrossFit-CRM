import utilsFunctions from "../../utils/functions";
const Functions = {
  getCoaches,
  updateValidStatus
};
export default Functions;

async function getCoaches(setCoaches) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "user/coach");
    const data = await response.json();
    if (response.ok) setCoaches(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function updateValidStatus(user_id, valid_status, setUpdate, setAuth) {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!(await utilsFunctions.auth())) return setAuth(false);

    const response = await fetch(process.env.REACT_APP_API_URL + `user/valid?user_id=${user_id}&valid_status=${valid_status}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      alert("updated valid status successfully");
      setUpdate(Date());
    } else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}
