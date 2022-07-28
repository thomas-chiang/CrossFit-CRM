import moment from "moment";

const Functions = {
  getMovements,
  getPerformanceByMovement,
  getUsersByRole,
  getUserWorkouts,
  getDistinctWorkoutMovements,
  getPerformanceByWorkoutMovement
};
export default Functions;

async function getMovements(setMovements) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "movement");
    let data = await response.json();
    for (let item of data) {
      item.label = item.name;
      item.value = item.id;
    }
    if (response.ok) setMovements(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function getDistinctWorkoutMovements(workout_id, setWorkoutMovements) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/distinctworkoutmovements/${workout_id}`);
    let data = await response.json();

    for (let item of data) {
      item.label = item.name;
      item.value = item.name;
    }

    if (response.ok) setWorkoutMovements(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function getUserWorkouts(user_id, setUserWorkouts) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `performance/workouts/${user_id}`);
    let data = await response.json();
    for (let item of data) {
      item.label = item.name;
      item.value = item.workout_id;
    }
    if (response.ok) setUserWorkouts(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

async function getPerformanceByMovement(user_id, movement_id, setLineDate) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL + `performance/movement?user_id=${user_id}&movement_id=${movement_id}`
    );
    let data = await response.json();
    if (response.ok) setLineDate(generateLineData(data));
    else alert(data.error);
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
}

async function getPerformanceByWorkoutMovement(user_id, workout_id, movement_id, setLineDate) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL +
        `performance/workoutmovement?user_id=${user_id}&workout_id=${workout_id}&movement_id=${movement_id}`
    );
    let data = await response.json();
    if (response.ok) setLineDate(generateLineData(data));
    else alert(data.error);
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
}

async function getUsersByRole(role_level, setCoaches) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `user/role/${role_level}`);
    let data = await response.json();

    for (let user of data) {
      user.value = user.id;
      user.label = user.name;
    }

    if (response.ok) setCoaches(data);
    else alert(data.error);
  } catch (e) {
    alert(e.message);
  }
}

function generateLineData(data) {
  let labels = [];
  let datasets = [
    {
      label: "kg",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    },
    {
      label: "rep",
      data: [],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    },
    {
      label: "meter",
      data: [],
      borderColor: "rgb(50,205,50)",
      backgroundColor: "rgba(50,205,50, 0.5)"
    },
    {
      label: "cal",
      data: [],
      borderColor: "rgb(255,165,0)",
      backgroundColor: "rgba(255,165,0, 0.5)"
    },
    {
      label: "round",
      data: [],
      borderColor: "rgb(186,85,211)",
      backgroundColor: "rgba(186,85,211, 0.5)"
    },
    {
      label: "minute",
      data: [],
      borderColor: "rgb(169,169,169)",
      backgroundColor: "rgba(169,169,169, 0.5)"
    }
  ];
  for (let item of data) {
    // labels.push(`${moment(item.start).local().format('YYYY/MM/DD')}: ${item.workout_name}`)
    labels.push(`${moment(item.start).local().format("YYYY/MM/DD")}`);
    datasets[0].data.push(item.kg === 0 ? null : item.kg);
    datasets[1].data.push(item.rep === 0 ? null : item.rep);
    datasets[2].data.push(item.meter === 0 ? null : item.meter);
    datasets[3].data.push(item.cal === 0 ? null : item.cal);
    datasets[4].data.push(item.round === 0 ? null : item.round);
    datasets[5].data.push(item.minute === 0 ? null : item.minute);
  }
  let lineData = { labels, datasets };
  return lineData;
}
