const globalException = require('../utils/globalException');
const knownlanguageModel = require('../models/knownlanguageModel');
const customConstants = require("../config/constants.json");


exports.createKnownLanguages = globalException(async (req, res) => {
    const query = {userId: req.params.userId};
    await knownlanguageModel.deleteMany(query);
    const userKnownLanguages = await knownlanguageModel.create(req.body)
    return res.status(201).json({status: 'success', message: customConstants.messages.MESSAGE_KNOWN_LANGUAGE_CREATE, data:userKnownLanguages});    
});


exports.updateknownLanguages = globalException(async (req, res) => {
    const query = {userId: req.params.userId};
    await knownlanguageModel.deleteMany(query);
    const userknownlanguages = await knownlanguageModel.create(req.body)
    return res.status(200).json({status: "success", message: customConstants.messages.MESSAGE_OTHER_LANGUAGE_CREATE, data: userknownlanguages});
});