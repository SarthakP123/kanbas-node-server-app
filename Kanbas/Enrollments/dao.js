import Database from "../Database/index.js";

export function enrollUserInCourse(userId, courseId) {
  // Function to enroll a user in a course
  const { enrollments } = Database;
  enrollments.push({ _id: Date.now().toString(), user: userId, course: courseId });
}
