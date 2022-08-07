const Functions = {
  getCourses
};

export default Functions;

async function getCourses(setCalendarEvents) {
  const response = await fetch(process.env.REACT_APP_API_URL + "course");
  const data = await response.json();
  setCalendarEvents(data);
}
