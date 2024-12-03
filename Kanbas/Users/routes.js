import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js"; // Import enrollments DAO

export default function UserRoutes(app) {
  const createUser = (req, res) => {
    // Placeholder for createUser logic
  };

  const deleteUser = (req, res) => {
    // Placeholder for deleteUser logic
  };

  const findAllUsers = (req, res) => {
    // Placeholder for findAllUsers logic
  };

  const findUserById = (req, res) => {
    // Placeholder for findUserById logic
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;

    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);

    req.session["currentUser"] = currentUser; // Update session with the updated user
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }

    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser; // Set session for the new user
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;

    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser; // Save logged-in user in session
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const findCoursesForEnrolledUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401); // Unauthorized if no user in session
      return;
    }

    const courses = courseDao.findCoursesForEnrolledUser(currentUser._id);
    if (courses.length === 0) {
      res.status(404).json({ message: "No courses found for the user." });
      return;
    }
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401); // Unauthorized if no user in session
      return;
    }

    const newCourse = courseDao.createCourse(req.body); // Create new course
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id); // Enroll user in course
    res.json(newCourse);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401); // Unauthorized if no user in session
      return;
    }
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy(); // Destroy the session
    res.sendStatus(200); // OK
  };

  // Routes
  app.post("/api/users/current/courses", createCourse); // Create and enroll course
  app.get("/api/users/current/courses", findCoursesForEnrolledUser); // Find courses for current user
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
