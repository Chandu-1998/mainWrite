const globalException = require('../utils/globalException');
const otherlanguageModel = require('../models/otherLanguageModel');
const customConstants = require("../config/constants.json");


exports.createOtherLanguages = globalException(async (req, res) => {
    const query = {userId: req.params.userId};
    await otherlanguageModel.deleteMany(query);
    const userOtherLanguages = await otherlanguageModel.create(req.body)
    return res.status(201).json({status: 'success', message: customConstants.messages.MESSAGE_OTHER_LANGUAGE_CREATE, data:userOtherLanguages});    
});

exports.updateOtherLanguages = globalException(async (req, res) => {
    const query = {userId: req.params.userId};
    await otherlanguageModel.deleteMany(query);
    const userOtherlanguages = await otherlanguageModel.create(req.body)
    return res.status(200).json({status: "success", message: customConstants.messages.MESSAGE_OTHER_LANGUAGE_UPDATE, data: userOtherlanguages});
});