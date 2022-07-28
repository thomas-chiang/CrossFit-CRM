import utilsFunctions from "../../utils/functions";
const Functions = {
  getOwnedGyms,
  addMember,
  getUsersByGymAndRole,
  deleteUserByGym,
  toLogin
};
export default Functions;

async function toLogin(setAuth) {
  if (!(await utilsFunctions.auth())) return setAuth(false);
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

async function getUsersByGymAndRole(setSelectedGymUsers, gym_id, role) {
  console.log();
  try {
    let token = localStorage.getItem("jwtToken");
    let response = await fetch(process.env.REACT_APP_API_URL + `user/bygymandrole/?gym_id=${gym_id}&role=${role}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await response.json();
    if (response.ok) setSelectedGymUsers(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
  }
}

async function addMember(gym_id, email, setUpdate, setAuth) {
  try {
    let token = localStorage.getItem("jwtToken");
    if (!(await utilsFunctions.auth())) return setAuth(false);

    let response = await fetch(process.env.REACT_APP_API_URL + "user/addmember", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gym_id,
        email
      })
    });
    let data = await response.json();
    if (response.ok) return setUpdate(Date());
    else alert(data.error);
  } catch (e) {
    alert(e);
  }
}

async function deleteUserByGym(user_id, gym_id, setUpdate, setAuth) {
  try {
    let token = localStorage.getItem("jwtToken");
    if (!(await utilsFunctions.auth())) return setAuth(false);
    console.log(user_id);
    console.log(gym_id);
    let response = await fetch(process.env.REACT_APP_API_URL + `user/bygym?gym_id=${gym_id}&user_id=${user_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let data = await response.json();
    if (response.ok) return setUpdate(Date());
    else alert(data.error);
  } catch (e) {
    alert(e);
  }
}
