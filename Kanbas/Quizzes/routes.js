// server/Kanbas/Quizzes/routes.js
import * as dao from "./dao.js";

export default function QuizRoutes(app) {
    const createQuiz = async (req, res) => {
        try {
          const quizData = {
            ...req.body,
            courseId: req.params.courseId
          };
          const quiz = await dao.createQuiz(quizData);
          res.json(quiz);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };

  const findQuizzesForCourse = async (req, res) => {
    const quizzes = await dao.findQuizzesForCourse(req.params.courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    try {
      const quiz = await dao.findQuizById(req.params.quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      console.log("Sending quiz:", quiz); // Debug log
      res.json(quiz);
    } catch (error) {
      console.error("Error finding quiz:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const updateQuiz = async (req, res) => {
    const status = await dao.updateQuiz(req.params.quizId, req.body);
    res.json(status);
  };

  const deleteQuiz = async (req, res) => {
    const status = await dao.deleteQuiz(req.params.quizId);
    res.json(status);
  };

  const addQuestion = async (req, res) => {
    const status = await dao.addQuestionToQuiz(req.params.quizId, req.body);
    res.json(status);
  };

  const updateQuestion = async (req, res) => {
    const status = await dao.updateQuestion(
      req.params.quizId,
      req.params.questionId,
      req.body
    );
    res.json(status);
  };

  const deleteQuestion = async (req, res) => {
    const status = await dao.deleteQuestion(req.params.quizId, req.params.questionId);
    res.json(status);
  };

  const recordAttempt = async (req, res) => {
    const status = await dao.recordAttempt(req.params.quizId, req.body);
    res.json(status);
  };
  const findAttemptsByUser = async (req, res) => {
    try {
      const attempts = await dao.findAttemptsByUser(
        req.params.quizId,
        req.params.userId
      );
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const submitAttempt = async (req, res) => {
    try {
      const attempt = await dao.recordAttempt(req.params.quizId, req.body);
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  app.get("/api/quizzes/:quizId/attempts/:userId", findAttemptsByUser);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.post("/api/quizzes/:quizId/questions", addQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
  app.post("/api/quizzes/:quizId/attempts", recordAttempt);
}