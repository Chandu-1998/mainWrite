const globalException = require('../utils/globalException');
const writerKnowledgeModel = require('../models/writerKnowledgeModel');
const customConstants = require("../config/constants.json");
const subscriptionModel = require('../models/subscriptionModel');
const paymentModel = require('../models/paymentModel');

exports.createWriterKnowledge = globalException(async (req, res) => { 
    // const query = {userId: req.params.userId};
    const userId = req.params
    // const userid = query.userId
    const userone = await subscriptionModel.findOne(userId)
    const paidOne = await paymentModel.findOne(userId)
    // console.log(userone,'////////////////////////////')
    // console.log(paidOne.endDate,'././././././././.../../././././.')
    const now = new Date()
    if(now > userone.endDate || paidOne.endDate > now){
        console.log('True')
    }
    else{
        console.log('False')
    }
    await writerKnowledgeModel.deleteMany(userId);
    const userWriterKnowledge = await writerKnowledgeModel.create(req.body);
    return res.status(201).json({status: 'success', message: customConstants.messages.MESSAGE_WRITER_KNOWLEDGE_CREATE});
});

exports.updateWriterKnowledge = globalException(async (req, res) => {
    // const query = {userId: req.params.userId};
    const userId = req.params
    const userone = await subscriptionModel.findOne(userId)
    
    // console.log(userone,'////////////////////////////')
    const now = new Date()
    if(now > userone.endDate){
        console.log('True')
    }
    else{
        console.log('False')
    }
    await writerKnowledgeModel.deleteMany(userId);
    const userWriterKnowledge = await writerKnowledgeModel.create(req.body)
    return res.status(200).json({status: "sucess", message: customConstants.messages.MESSAGE_WRITER_KNOWLEDGE_UPDATE});
});