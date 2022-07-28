const Functions = {
  getUserProfile
};
export default Functions;

async function getUserProfile(setUser, appContext) {
  try {
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + "user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
    if (response.ok) {
      setUser(data);
      appContext.setUser(data);
    } else {
      console.log(data.error);
      localStorage.removeItem("jwtToken");
      setUser(null);
    }
  } catch (e) {
    alert(e.message);
  }
}
