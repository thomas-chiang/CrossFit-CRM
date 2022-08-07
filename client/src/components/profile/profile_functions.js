const Functions = {
  getRole
};
export default Functions;

async function getRole(setRole) {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await fetch(process.env.REACT_APP_API_URL + "token", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
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
