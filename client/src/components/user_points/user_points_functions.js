const Functions = {
  getSumPointsByUser
};
export default Functions;

async function getSumPointsByUser(user_id, setPoints) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `user/sumpoint/${user_id}`);
    let data = await response.json();
    if (response.ok) setPoints(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}
