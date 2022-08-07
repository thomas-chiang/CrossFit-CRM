const Functions = {
  getUserProfile
};
export default Functions;

async function getUserProfile(setUser, appContext) {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await fetch(process.env.REACT_APP_API_URL + "user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
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
