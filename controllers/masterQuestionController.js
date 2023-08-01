const globalException = require('../utils/globalException');
const masterQuestionModel = require("../models/masterQuestionModel");
const customConstants = require("../config/constants.json");

exports.addQuestion = globalException(async (req, res) => {
    const masterQuestion = await masterQuestionModel.create(req.body)
    return res.status(201).json({status: "success", message: customConstants.messages.MESSAGE_MASTER_QUESTIONS_CREATE, data:masterQuestion});
});

exports.getQuestion = globalException(async (req, res) => {
    const {questionId:_id} = req.params;
    const masterQuestion = await masterQuestionModel.findById(_id);
    return res.status(200).json({status: 'success', message: customConstants.messages.MESSAGE_MASTER_QUESTIONS_GETSIN, data:masterQuestion});
});

exports.getAllQuestions = globalException(async (_req, res) => {
    const knownLanguages = await masterQuestionModel.find({questionCategoryType : "known-language"}).sort({questionNumber : 1});
    const otherLanguages = await masterQuestionModel.find({questionCategoryType : "other-language"}).sort({questionNumber : 1});
    const writerExpertise = await masterQuestionModel.find({questionCategoryType : "writer-expertise"}).sort({questionNumber : 1});
    const writerKnowledge = await masterQuestionModel.find({questionCategoryType : "writer-Knowledge"}).sort({questionNumber : 1});
    const termsAndConditions = await masterQuestionModel.find({questionCategoryType : "terms-and-conditions"}).sort({questionNumber : 1});
    return res.status(200).json({status: 'success', message: customConstants.messages.MESSAGE_MASTER_QUESTIONS_GETALL, data : {knownLanguages : knownLanguages, otherLanguages:otherLanguages, writerExpertise:writerExpertise, writerKnowledge: writerKnowledge, termsAndConditions : termsAndConditions}});
});

exports.updateQuestion = globalException(async (req, res) => {
    const {questionId:_id} = req.params;
    const masterQuestion = await masterQuestionModel.findByIdAndUpdate(_id, req.body)
    return res.status(200).json({status:"success", message:customConstants.messages.MESSAGE_MASTER_QUESTIONS_UPDATE, data:masterQuestion});
});

exports.deleteQuestion = globalException(async (req, res, next) => {
    const {questionId:_id} = req.params;
    const masterQuestion = await masterQuestionModel.findByIdAndDelete(_id);
    return res.status(204).json({status: 'success', message: customConstants.messages.MESSAGE_MASTER_QUESTIONS_DELETE});
});

