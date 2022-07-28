import moment from "moment";

const Functions = {
  getMovements,
  getPerformanceByMovement,
  getUsersByRole,
  getUserWorkouts,
  getDistinctWorkoutMovements,
  getPerformanceByWorkoutMovement,
  getPerformanceByWorkout,
  getWorkoutsWithMovements
};
export default Functions;

async function getWorkoutsWithMovements(workout_id, setWorkoutWithMovements) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workout/${workout_id}`);
    let data = await response.json();
    if (response.ok) setWorkoutWithMovements(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
  }
}

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
    if (response.ok) setLineDate(generateBarData(data));
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
    if (response.ok) setLineDate(generateBarData(data));
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

async function getPerformanceByWorkout(user_id, workout_id, distinctMovements, setMovementArr) {
  try {
    let reqQuery = "";
    for (let movement of distinctMovements) {
      reqQuery += `movement_ids=${movement.movement_id}&`;
    }
    const response = await fetch(
      process.env.REACT_APP_API_URL + `performance/analysis?${reqQuery}&user_id=${user_id}&workout_id=${workout_id}`
    );
    let data = await response.json();

    let minLength = data[0].length;
    let minIndex = 0;
    let updatedDistinctMovements = [];
    for (let movement of distinctMovements) updatedDistinctMovements.push(movement);
    if (response.ok) {
      for (let [index, movmemnt] of updatedDistinctMovements.entries()) {
        minLength = Math.min(data[index].length, minLength);
        if (data[minIndex].length > minLength) minIndex = index;

        movmemnt.barData = generateBarData(data[index]);
      }

      let round = {
        name: "Rounds & Minutes",
        barData: generateRoundData(data[minIndex])
      };

      updatedDistinctMovements.unshift(round);

      setMovementArr(updatedDistinctMovements);
    } else alert(data.error);
  } catch (e) {
    alert(e);
  }
}

function generateRoundData(data) {
  let labels = [];
  let datasets = [
    {
      label: "round",
      data: [],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    },
    {
      label: "minute",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    }
  ];
  for (let item of data) {
    labels.push(`${moment(item.start).local().format("YY/MM/DD")}`);
    datasets[0].data.push(item.round === 0 ? null : item.round);
    datasets[1].data.push(item.minute === 0 ? null : item.minute);
  }
  let roundData = { labels, datasets };
  return roundData;
}

function generateBarData(data) {
  let labels = [];
  let datasets = [
    {
      label: "kg",
      data: [],
      borderColor: "rgb(169,169,169)",
      backgroundColor: "rgba(169,169,169, 0.5)"
    },
    {
      label: "rep",
      data: [],
      borderColor: "rgb(186,85,211)",
      backgroundColor: "rgba(186,85,211, 0.5)"
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
    }
  ];
  for (let item of data) {
    labels.push(`${moment(item.start).local().format("YY/MM/DD")}`);
    if (item.kg > 0) datasets[0].data.push(item.kg === 0 ? null : item.kg);
    if (item.rep > 0) datasets[1].data.push(item.rep === 0 ? null : item.rep);
    if (item.meter > 0) datasets[2].data.push(item.meter === 0 ? null : item.meter);
    if (item.cal > 0) datasets[3].data.push(item.cal === 0 ? null : item.cal);
  }

  let updatedDatasets = [];
  for (let dataset of datasets) {
    if (dataset.data.length > 0) updatedDatasets.push(dataset);
  }

  datasets = updatedDatasets;

  let barData = { labels, datasets };
  return barData;
}
