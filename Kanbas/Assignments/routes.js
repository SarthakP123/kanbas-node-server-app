import * as dao from "./dao.js";

export default function AssignmentsRoutes(app) {
  app.delete("/api/assignments/:assignmentID", async (req, res) => {
    try {
      const { assignmentID } = req.params;
      const status = await dao.deleteAssignment(assignmentID);
      res.status(200).send(status);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  app.put("/api/assignments/:assignmentID", async (req, res) => {
    try {
      const { assignmentID } = req.params;
      const assignmentUpdates = req.body;
      const updatedAssignment = await dao.updateAssignment(assignmentID, assignmentUpdates);
      res.status(200).send(updatedAssignment);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

  app.get("/api/assignments", async (req, res) => {
    const { courseID } = req.query;
    if (!courseID) {
      return res.status(400).send({ error: "courseID is required" });
    }
    const assignments = await dao.findAssignmentsForCourse(courseID);
    res.status(200).send(assignments);
  });
}
