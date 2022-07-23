require("dotenv").config();
const { expect, requester } = require("./set_up");
const { users, performance } = require("./fake_data");
const moment = require("moment");
const { pool } = require("../server/models/mysql_conn");
const { getPerformanceByWorkoutMovement } = require("../server/models/performance_model");

const member1 = users[1];
const user = {
  role: member1.role,
  email: member1.email,
  password: member1.password
};
let userId;

let course1Data;

let workout1Data;

let movement1Id;

describe("performance", () => {
  before(async () => {
    const signinRes = await requester.post("/api/user/signin").send(user);
    const userData = signinRes.body;
    accessToken = userData.access_token;
    userId = userData.user.id;

    const courseRes = await requester.get("/api/course");
    course1Data = courseRes.body[0];

    const workoutRes = await requester.get("/api/workout");
    workout1Data = workoutRes.body[0];

    const movementRes = await requester.get("/api/movement");
    const movementData = movementRes.body;
    movement1Id = movementData[0].id;
  });

  it("[unit] get performances by specific user, workout, movement", async () => {
    const workout1Id = workout1Data.id;
    const result = await getPerformanceByWorkoutMovement(userId, workout1Id, movement1Id);
    const performance1 = result[0];
    performance1.start = moment(performance1.start).format("YYYY-MM-DD HH:mm");

    const expectedWorkoutName = workout1Data.name;
    const expectedTime = moment(course1Data.start).format("YYYY-MM-DD HH:mm");
    const expectedKg = performance.kg;
    const expectedRep = performance.rep;
    const expectedMeter = performance.meter;
    const expectedCal = performance.cal;
    const expectedRound = performance.round;
    const expectedMinute = performance.minute;
    const expectedExtraCount = performance.extra_count;
    const expectedExtraSec = performance.extra_sec;

    expect(performance1.workout_name).to.equal(expectedWorkoutName);
    expect(performance1.start).to.equal(expectedTime);
    expect(performance1.kg).to.equal(expectedKg);
    expect(performance1.rep).to.equal(expectedRep);
    expect(performance1.meter).to.equal(expectedMeter);
    expect(performance1.cal).to.equal(expectedCal);
    expect(performance1.round).to.equal(expectedRound);
    expect(performance1.meter).to.equal(expectedMinute);
    expect(performance1.extra_count).to.equal(expectedExtraCount);
    expect(performance1.extra_sec).to.equal(expectedExtraSec);
  });
});
