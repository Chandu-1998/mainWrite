const mongoose = require('mongoose')
const knownLanguagueSchema = mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: [true, 'Question no required.'],
    },
    questionType: {
      type: String,
      required: [true, 'Question type required.'],
      default: "Single",
      enum: {
          values: ["Single", "MultipleChoice", "Form", "YESNO", "TextField", "Label"],
          message: "QuestionType should be Single, MultipleChoice, Form, YESNO only.",
      }
    },
    questionText: {
      type: String,
      trim: true,
      required: [true, "Question required."],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      //unique: true, // need to write unique
      required: [true, "userId required."],
    },
    
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "masterquestion",
      index: true,
      required: [true, "QuestionId required."],
    },
    
    answers: {
      type: Array,
      default: [],
      required: [true, "QuestionAnswer required."],
    },
    comments: {
      type: String,
      default: null,
      trim:true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('knownlanguage', knownLanguagueSchema);