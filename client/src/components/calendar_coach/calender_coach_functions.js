const Functions = {
  getCourses,
  updateArr
};

export default Functions;

async function getCourses(setCalendarEvents) {
  const response = await fetch(process.env.REACT_APP_API_URL + "course");
  const data = await response.json();
  setCalendarEvents(data);
}

function updateArr(calendarEvents, arr, setArr) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    const selectedCourseId = arr[i].id;
    for (let event of calendarEvents) {
      if (event.id == selectedCourseId) newArr.push(event); // ==
      continue;
    }
  }

  setArr(newArr);
}
