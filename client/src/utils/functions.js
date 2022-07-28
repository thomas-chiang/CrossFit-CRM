const Functions = {
  getUserData,
  auth
};
export default Functions;

async function getUserData() {
  try {
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + "user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
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
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + "token", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
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
