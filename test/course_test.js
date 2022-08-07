require("dotenv").config();
const { expect, requester } = require("./set_up");
const { courses, users } = require("./fake_data");
const moment = require("moment");
const { pool } = require("../server/models/mysql_conn");
const { convertToObjWithCourseIdAsKey } = require("../utils/data_restructure_util");

const member1 = users[1];
const user = {
  role: member1.role,
  email: member1.email,
  password: member1.password
};
let accessToken;
let course2Id;
let userId;

describe("courses", () => {
  before(async () => {
    const res1 = await requester.post("/api/user/signin").send(user);
    const userData = res1.body;
    accessToken = userData.access_token;
    userId = userData.user.id;
    const res2 = await requester.get("/api/course");
    const courseData = res2.body;
    course2Id = courseData[1].id;
  });

  it("get courses", async () => {
    const res = await requester.get("/api/course");

    const courseResults = res.body;

    expect(courseResults.length).to.equal(2);
    courseResults.forEach((course) => {
      course.start = moment(course.start).format("YYYY-MM-DD HH:mm");
      course.end = moment(course.end).format("YYYY-MM-DD HH:mm");
    });

    const courseExpected = courses[0];

    expect(courseResults[0]).to.includes(courseExpected);
  });

  it("enroll course", async () => {
    await requester.post(`/api/course/enrollment/${course2Id}`).set("Authorization", `Bearer ${accessToken}`);
    const [secondCourseUsers] = await pool.query("SELECT * FROM course_user where course_id = ?", [course2Id]);
    expect(secondCourseUsers[0].user_id).to.equal(userId);
  });

  it("[unit test] function: convertToObjWithCourseIdAsKey to return obj with correct properties", async () => {
    const fakeInput = [
      {
        id: 1,
        title: 'Course1 at 08/09 13:10',
        size: 8,
        note: 'some note',
        point: 1,
        checkout: 0,
        role: 1,
        user_id: 2,
        user_name: 'Authur',
        is_coach: 1
      },
      {
        id: 1,
        title: 'Course1 at 08/09 13:10',
        size: 8,
        note: 'some note',
        point: 1,
        checkout: 0,
        role: 2,
        user_id: 3,
        user_name: 'John',
        enrollment: 1,
        is_coach: 0
      },
      {
        id: 2,
        title: 'Course2 at 08/09 14:10',
        size: 8,
        note: 'some note',
        point: 1,
        checkout: 0,
        role: 1,
        user_id: 2,
        user_name: 'Authur',
        enrollment: 1,
        is_coach: 0
      }
    ]
    
    const res = convertToObjWithCourseIdAsKey(fakeInput)
    expect(res.hasOwnProperty(fakeInput[0].id)).to.be.true
    expect(res.hasOwnProperty(fakeInput[2].id)).to.be.true
    expect(res[fakeInput[0].id].participants[fakeInput[0].user_id].name).to.equal(fakeInput[0].user_name)
  });
});
