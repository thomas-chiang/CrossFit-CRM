const Functions = {
  getCourses,
  updateArr
};

export default Functions;

async function getCourses(setCalendarEvents) {
  const response = await fetch(process.env.REACT_APP_API_URL + "course");
  let data = await response.json();
  //console.log(data[0].members)
  setCalendarEvents(data);
}

function updateArr(calendarEvents, arr, setArr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    let selectedCourseId = arr[i].id;
    for (let event of calendarEvents) {
      if (event.id == selectedCourseId) newArr.push(event);
      continue;
    }
  }
  setArr(newArr);
}
