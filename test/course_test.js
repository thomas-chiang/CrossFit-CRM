require("dotenv").config();
const { expect, requester } = require("./set_up");
const { courses, users } = require("./fake_data");
const moment = require("moment");
const { pool } = require("../server/models/mysql_conn");

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
    await requester.post(`/api/course/enroll/${course2Id}`).set("Authorization", `Bearer ${accessToken}`);

    const [secondCourseUsers] = await pool.query("SELECT * FROM course_user where course_id = ?", [course2Id]);
    expect(secondCourseUsers[0].user_id).to.equal(userId);
  });
});
