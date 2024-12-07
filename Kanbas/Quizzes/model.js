// Kanbas/Quizzes/model.js
import mongoose from "mongoose";
import quizSchema from "./schema.js";

const QuizModel = mongoose.model("Quiz", quizSchema);
export default QuizModel;