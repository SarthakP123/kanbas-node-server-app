// dao.js
import model from "./model.js";

export const createQuiz = (quiz) => {
  // Create a new quiz with questions included
  return model.create(quiz);
};

export const findQuizzesForCourse = (courseId) => {
  return model.find({ courseId });
};

export const findQuizById = (quizId) => {
  return model.findById(quizId);
};

export const updateQuiz = async (quizId, quiz) => {
  // Make sure to keep _id fields for existing questions
  let existingQuiz;
  try {
    existingQuiz = await model.findById(quizId);
  } catch (error) {
    console.error("Error finding existing quiz:", error);
    throw error;
  }

  if (!existingQuiz) {
    throw new Error("Quiz not found");
  }

  // Map new questions to existing ones if they have IDs
  const updatedQuestions = quiz.questions.map(question => {
    if (question._id) {
      // If the question has an ID, it's an existing question
      return {
        ...question,
        _id: question._id // Preserve the existing _id
      };
    } else {
      // If it's a new question, let MongoDB generate a new _id
      return {
        ...question
      };
    }
  });

  // Update the quiz with the properly structured questions
  const updatedQuiz = {
    ...quiz,
    questions: updatedQuestions
  };

  return model.findByIdAndUpdate(
    quizId,
    { $set: updatedQuiz },
    { 
      new: true,
      runValidators: true // This ensures schema validation runs on update
    }
  );
};

export const deleteQuiz = (quizId) => {
  return model.findByIdAndDelete(quizId);
};

// Update your addQuestionToQuiz to handle _id properly
export const addQuestionToQuiz = async (quizId, question) => {
  const newQuestion = {
    ...question,
    _id: new mongoose.Types.ObjectId() // Generate new _id for the question
  };

  return model.findByIdAndUpdate(
    quizId,
    { $push: { questions: newQuestion } },
    { new: true }
  );
};

// Update your updateQuestion to properly handle the question update
export const updateQuestion = async (quizId, questionId, question) => {
  return model.findOneAndUpdate(
    { 
      _id: quizId, 
      "questions._id": questionId 
    },
    { 
      $set: { 
        "questions.$": {
          ...question,
          _id: questionId // Preserve the question's _id
        }
      } 
    },
    { new: true }
  );
};

// The rest of your DAO methods remain the same

export const deleteQuestion = (quizId, questionId) => {
  return model.findByIdAndUpdate(
    quizId,
    { $pull: { questions: { _id: questionId } } },
    { new: true }
  );
};


// server/Kanbas/Quizzes/dao.js
export const findAttemptsByUser = async (quizId, userId) => {
  const quiz = await model.findById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  return quiz.attempts.filter(attempt => attempt.userId.toString() === userId);
};

// server/Kanbas/Quizzes/dao.js
export const recordAttempt = async (quizId, attempt) => {
  try {
    const quiz = await model.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const newAttempt = {
      userId: attempt.userId,
      score: attempt.score,
      answers: attempt.answers,
      startTime: attempt.startTime,
      endTime: attempt.endTime
    };

    quiz.attempts.push(newAttempt);
    await quiz.save();

    return newAttempt; // Return the newly created attempt
  } catch (error) {
    console.error("Error recording attempt:", error);
    throw error;
  }
};