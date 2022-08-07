require("dotenv").config();
const ROLE = {
  MEMBER: 1,
  COACH: 2,
  GYM_OWNER: 3
}
const IS_COACH = 1;


const addYoutubeIdProperty = (arrayOfObjs) => {
  arrayOfObjs.forEach((obj) => {
    let youtube_id = null;

    const originalYoutubeLink = obj.demo_link;

    if (originalYoutubeLink.includes("https://www.youtube.com/")) {
      youtube_id = originalYoutubeLink.slice(originalYoutubeLink.indexOf("watch?v=") + 8, originalYoutubeLink.indexOf("&"));
    }

    if (originalYoutubeLink.includes("https://youtu.be/")) {
      youtube_id = originalYoutubeLink.slice(17);
    }

    obj.youtube_id = youtube_id;
  });
};

const addYoutubeEmbedLinkProperty = (arrayOfObjs) => {
  arrayOfObjs.forEach((obj) => {
    let embedLink = "https://www.youtube.com/embed/";

    const youtube_id = obj.youtube_id;

    embedLink += youtube_id;

    obj.embed_link = embedLink;
  });
};

const addReactSelectProperties = (arrayOfObjs, propertyForValue, propertyForLabel) => {
  arrayOfObjs.forEach((obj) => {
    obj.value = obj[propertyForValue];
    obj.label = obj[propertyForLabel];
  });
};


const addReactSelectPropertiesForRole = (users) => {
  users.forEach((user) => {
    user.value = user.role;
    switch (user.role) {
      case ROLE.MEMBER:
        user.label = "Member";
        break;
      case ROLE.COACH:
        user.label = "Coach";
        break;
      case ROLE.GYM_OWNER:
        user.label = "Owner";
        break;
    }
  });
};


const updateCoursePropertyByWorkoutObj = (course, workoutObj) => {
  const workouts = Object.keys(workoutObj).map((workout_id) => workoutObj[workout_id]);
  addReactSelectProperties(workouts, "id", "name");
  course.workouts = workouts;
};

const updateCoursePropertyByParticipantsObj = (course, participantsObj) => {
  const participants = Object.keys(participantsObj).map((user_id) => participantsObj[user_id]);
  addReactSelectProperties(participants, "id", "name");
  const coaches = participants.filter((participant) => participant.role >= ROLE.COACH && participant.is_coach == IS_COACH);
  const members = participants.filter((participant) => participant.role >= ROLE.MEMBER && participant.enrollment !== null);
  const enrolledMembers = members.filter((member) => member.enrollment >= 1);
  course.members = members.sort((a, b) => a.enrollment - b.enrollment);
  course.coaches = coaches;
  course.size_enrolled = enrolledMembers.length;
};



module.exports = {
  addYoutubeIdProperty,
  addYoutubeEmbedLinkProperty,
  addReactSelectProperties,
  addReactSelectPropertiesForRole,
  updateCoursePropertyByWorkoutObj,
  updateCoursePropertyByParticipantsObj,
};
