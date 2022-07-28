const Functions = {
  getUserProfile,
  logout,
  getOwnedGyms
};
export default Functions;

async function getUserProfile(setUser, setAuth, appContext) {
  try {
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + "user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
    if (response.ok) {
      setUser(data);
    } else {
      console.log(data.error);
      localStorage.removeItem("jwtToken");
      setAuth(false);
      appContext.setUpdate(!appContext.update);
    }
  } catch (e) {
    alert(e.message);
  }
}

function logout(setLogout, appContext) {
  localStorage.removeItem("jwtToken");
  setLogout(true);
  appContext.setUpdate(!appContext.update);
}

async function getOwnedGyms(setOwnedGyms) {
  try {
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + "gym/owned", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
    if (response.ok) setOwnedGyms(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
  }
}
