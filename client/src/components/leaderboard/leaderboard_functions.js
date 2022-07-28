const Functions = {
  getWorkouts,
  getLeaderboardByWorkouts,
  getWorkout,
  getDistinctWorkoutMovements
};
export default Functions;

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

async function getWorkouts(setWorkouts) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "workout/");
    let data = await response.json();
    if (response.ok) setWorkouts(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
    //alert(e.message)
  }
}

async function getLeaderboardByWorkouts(selectedWorkouts, setLeaderboards) {
  try {
    let reqQuery = "";
    for (let workout of selectedWorkouts) {
      reqQuery += `workout_ids=${workout.id}&`;
    }

    const response = await fetch(process.env.REACT_APP_API_URL + `performance/leaderboard/workout?${reqQuery}`);
    let data = await response.json();

    let arr = [];
    for (let item of data) {
      arr.push({
        ...generateBarData(item.leaders),
        ...item
      });
    }

    if (response.ok) setLeaderboards(arr);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
  }
}

async function getWorkout(workout_id, setUpdatedWorkout) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + `workout/workout/${workout_id}`);
    let data = await response.json();
    if (response.ok) setUpdatedWorkout(data);
    else console.log(data.error);
  } catch (e) {
    console.log(e);
  }
}

function generateBarData(data) {
  let labels = [];
  let datasets = [
    {
      label: "score",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    },
    {
      label: "round & minute",
      data: [],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    },
    {
      label: "movements",
      data: [],
      borderColor: "rgb(169,169,169)",
      backgroundColor: "rgba(169,169,169, 0.5)"
    }
  ];
  for (let item of data) {
    labels.push(item.name);
    datasets[0].data.push(item.score);
    datasets[1].data.push(item.round_minute);
    datasets[2].data.push(item.other);
  }
  let barData = { labels, datasets };
  return barData;
}
