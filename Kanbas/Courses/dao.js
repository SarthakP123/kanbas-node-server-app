import Database from "../Database/index.js";

export function findAllCourses() {
  return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;
  const enrolledCourses = courses.filter((course) =>
    enrollments.some(
      (enrollment) => enrollment.user === userId && enrollment.course === course._id
    )
  );
  console.log("Enrolled Courses:", enrolledCourses); // Debugg
  return enrolledCourses;
}

export function createCourse(course) {
  // Added function to create a new course
  const newCourse = { ...course, _id: Date.now().toString() };
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
}

export function deleteCourse(courseId) {
  // Added function to delete a course and its enrollments
  const { courses, enrollments } = Database;
  Database.courses = courses.filter((course) => course._id !== courseId);
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId
  );
}

export function updateCourse(courseId, courseUpdates) {
  // Added function to update a course
  const { courses } = Database;
  const course = courses.find((course) => course._id === courseId);
  Object.assign(course, courseUpdates);
  return course;
}
