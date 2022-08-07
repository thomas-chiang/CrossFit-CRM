const Functions = {
  getUserData,
  auth
};
export default Functions;

async function getUserData() {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await fetch(process.env.REACT_APP_API_URL + "user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.log(data.error);
      localStorage.removeItem("jwtToken");
    }
  } catch (e) {
    alert(e.message);
  }
}

async function auth() {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await fetch(process.env.REACT_APP_API_URL + "token", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok) {
      return true;
    } else {
      console.log(data.error);
      localStorage.removeItem("jwtToken");
    }
  } catch (e) {
    alert(e.message);
  }
}
