const Functions = {
  getWorkouts
};
export default Functions;

async function getWorkouts(setWorkouts) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "workout/");
    let data = await response.json();
    if (response.ok) setWorkouts(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}
