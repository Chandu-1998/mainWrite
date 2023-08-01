const globalException = require('../utils/globalException');
const writerExpertModel = require('../models/writerExpertModel');
const customConstants = require("../config/constants.json");
const subscriptionModel = require('../models/subscriptionModel');
const paymentModel = require('../models/paymentModel')

exports.createWriterExpertise = globalException(async (req, res,endDate) => {
    const {userId} = req.params
    const userone = await subscriptionModel.findOne({userId})
    const paidOne = await paymentModel.findOne({userId})
    // console.log(paidOne,'./././././././././././././.')
    const now = new Date()
    // console.log(userone.endDate,'..............')
    if(now > userone.endDate ){
        console.log('True')
    }
    else{
        console.log('False')
    }
    const userWriterExpert = await writerExpertModel.create(req.body);
    return res.status(201).json({status: 'success', message: customConstants.messages.MESSAGE_WRITER_EXPERT_CREATE});
});

exports.updatewriterExpertise = globalException(async (req, res) => {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true};
    const query = {userId: req.params.userId}
    const userknownlanguage = await writerExpertModel.findOneAndUpdate(query, req.body)
    return res.status(200).json({status: "success", message: customConstants.messages.MESSAGE_WRITER_EXPERT_UPDATE});
});