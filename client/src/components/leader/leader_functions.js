const Functions = {
  getLeader
};

export default Functions;

async function getLeader(member, setPerformances, originalMovements) {
  try {
    let response = await fetch(
      process.env.REACT_APP_API_URL +
        `performance/leaderboard/leader/?course_id=${member.course_id}&user_id=${member.user_id}&workout_id=${member.workout_id}`
    );
    let data = await response.json();
    for (const [index, value] of data.entries()) {
      data[index].original_kg = originalMovements[index].kg;
      data[index].original_rep = originalMovements[index].rep;
      data[index].original_meter = originalMovements[index].meter;
      data[index].original_cal = originalMovements[index].cal;
    }

    if (response.ok) {
      setPerformances(data);
    } else {
      console.log(data.error);
      localStorage.removeItem("jwtToken");
    }
  } catch (e) {
    console.log(e.message);
  }
}
