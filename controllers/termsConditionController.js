const globalException = require('../utils/globalException');
const termsConditionsModel = require('../models/termsConditionsModel');
const customConstants = require("../config/constants.json");


exports.createTermsAndConditions = globalException(async (req, res) => {
    const query = {userId: req.params.userId};
    await termsConditionsModel.deleteMany(query);
    const userTermsConditions = await termsConditionsModel.create(req.body);
    return res.status(201).json({status: 'success', message: customConstants.messages.MESSAGE_TERMS_AND_CONDITIONS_CREATE, data:userTermsConditions});
    
});

exports.updateTermsAndConditions = globalException(async (req, res, next) => {
    const query = {userId: req.params.userId}
    await termsConditionsModel.deleteMany(query)
    const userTermsConditions = await termsConditionsModel.create(req.body);
    return res.status(201).json({status: 'success', message: customConstants.messages.MESSAGE_TERMS_AND_CONDITIONS_UPDATE, data:userTermsConditions});
});