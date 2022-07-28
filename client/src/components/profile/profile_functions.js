import utilsFunctions from "../../utils/functions";
const Functions = {
  getRole
};
export default Functions;

async function getRole(setRole) {
  try {
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + "token", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
    if (response.ok) {
      setRole(data.role);
    } else {
      console.log(data.error);
      localStorage.removeItem("jwtToken");
    }
  } catch (e) {
    console.log(e.message);
  }
}
