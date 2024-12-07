// server/Kanbas/Quizzes/schema.js
import mongoose from "mongoose";

// schema.js
const questionSchema = new mongoose.Schema({
    _id: { 
      type: mongoose.Schema.Types.ObjectId, 
      auto: true 
    },
    title: { 
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK'],
      default: 'MULTIPLE_CHOICE',
      required: true
    },
    points: { 
      type: Number, 
      default: 1,
      required: true 
    },
    question: { 
      type: String,
      required: true
    },
    choices: [String],
    correctAnswer: { 
      type: String,
      required: true
    },
    possibleAnswers: [String]
  });

const quizSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true 
  },
  title: { type: String, required: true },
  description: String,
  published: { type: Boolean, default: false },
  quizType: {
    type: String,
    enum: ['GRADED_QUIZ', 'PRACTICE_QUIZ', 'GRADED_SURVEY', 'UNGRADED_SURVEY'],
    default: 'GRADED_QUIZ'
  },
  points: { type: Number, default: 0 },
  assignmentGroup: {
    type: String,
    enum: ['QUIZZES', 'EXAMS', 'ASSIGNMENTS', 'PROJECT'],
    default: 'QUIZZES'
  },
  shuffleAnswers: { type: Boolean, default: true },
  timeLimit: { type: Number, default: 20 },
  multipleAttempts: { type: Boolean, default: false },
  maxAttempts: { type: Number, default: 1 },
  showCorrectAnswers: { type: Boolean, default: true },
  accessCode: String,
  oneQuestionAtATime: { type: Boolean, default: true },
  webcamRequired: { type: Boolean, default: false },
  lockQuestionsAfterAnswering: { type: Boolean, default: false },
  dueDate: Date,
  availableFrom: Date,
  availableUntil: Date,
  questions: [questionSchema],
  attempts: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      answer: String,
      correct: Boolean
    }],
    startTime: Date,
    endTime: Date
  }]
}, { collection: 'Quizzes' });

export default quizSchema;