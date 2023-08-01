const mongoose = require('mongoose')
const masterQuestionSchema = mongoose.Schema({
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
        required: [true, 'QuestionText required.'],
    },
    questionCategoryType: {
        type: String,
        required: [true, 'Question category type required.'],
    },
    createdBy: {
        type: Number,
        required: [true, 'CreatedBy required.'],
    },
    dependencyQuestion: {
        type: Array,
        default: []
    },
    answers: {
        type: Array,
        default: [],
        required : [true, "Answers required."]
    },
    comments: {
        type:Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model('masterquestion', masterQuestionSchema);

