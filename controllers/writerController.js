const { default: mongoose } = require("mongoose");
const knownlanguageModel = require("../models/knownlanguageModel");
const termsConditionsModel = require("../models/termsConditionsModel");
const userModel = require("../models/userModel");
const writerExpertModel = require("../models/writerExpertModel");
const writerKnowledgeModel = require("../models/writerKnowledgeModel");
const globalException = require("../utils/globalException");
const otherLanguageModel = require("../models/otherLanguageModel");
const customConstants = require("../config/constants.json");

const getModuleTypeData = async (query) => {
    if(query.moduleType === "known-languages")
       return await knownlanguageModel.find({userId: query.userId});

    if(query.moduleType === "writer-experts")
       return await writerExpertModel.find({userId: query.userId});
    
    if(query.moduleType === "writer-knowledge")
       return await writerKnowledgeModel.find({userId: query.userId});
    
    if(query.moduleType === "terms-conditions")
       return await termsConditionsModel.find({userId: query.userId});

    if(query.moduleType === "writer-others")
        return await otherLanguageModel.find({userId : query.userId});
}

exports.getIndividualWriterDetails = globalException(async (req, res) => {
    const user = await userModel.findById(req.query.userId);
    if("moduleType" in req.query) {
        const userSelectedModule = await getModuleTypeData(req.query)
        return res.status(200).json({status:'success', message:customConstants.messages.MESSAGE_WRITER_GET, data:userSelectedModule});
    } else {
        const userKnowledgeLanguage = await knownlanguageModel.find({userId: mongoose.Types.ObjectId(req.query.userId)}).sort({questionNumber : 1});
        const userOtherLanguage = await otherLanguageModel.find({userId: req.query.userId}).sort({questionNumber : 1});
        const userWriterExpert = await writerExpertModel.find({userId: req.query.userId}).sort({questionNumber : 1});
        const userWriterKnowledge = await writerKnowledgeModel.find({userId: req.query.userId}).sort({questionNumber : 1});
        const userTermsAndConditions = await termsConditionsModel.find({userId: req.query.userId}).sort({questionNumber : 1});
        return res.status(200).json({status:'success', message:customConstants.messages.MESSAGE_WRITER_GET, data:{userKnowledgeLanguage : userKnowledgeLanguage, userWriterExpert : userWriterExpert, userWriterKnowledge : userWriterKnowledge, userTermsAndConditions : userTermsAndConditions, userOtherLanguage : userOtherLanguage }}); 
    }
});


exports.searchWriters = globalException(async (req, res) => {
    try{

    
    // return res.status(200).json(req.body);
    let { exp, questionIds, genre, knownLanguages, otherKnownLanguages, translateLanguages } = req.body
    let searchedUsers = {};
    let finalSearchedUsers = [];
    let intialFilterSearchStatus = false;
    let userIds = [];    
    let usersIn = [];
    let userDetails = [];

    if(genre === undefined && questionIds === undefined && exp === undefined && knownLanguages === undefined && otherKnownLanguages === undefined && translateLanguages === undefined){
        return res.status(200).json({status:'error', message:customConstants.messages.MESSAGE_WRITER_NOT_FOUND});
    }
    // mongoose.set("debug", (collectionName, method, query, doc) => {
    //     console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
    // });
    if(genre.length) {
        intialFilterSearchStatus = true
        let userObj = {};
        let genreArray = []

        genre.forEach((item) => {
            let key  = Object.keys(item);
            let value  = Object.values(item);
            let genreObj = {}
            genreObj[`answers.${key[0]}`] = { $in: value[0]  }
            genreArray.push(genreObj)
        })
        if(exp) {
            userObj = {
                path: 'userId',
                match: {yearsOfExperience: {$gte: exp}},
                select: '_id'
            }
        } 
        if(typeof exp == 'undefined') {
             userObj = {
                path: 'userId',
                select: '_id'
            }
        }
        userIds = await writerExpertModel.find({$or: genreArray}, 'user').populate(userObj);
        userIds.forEach((user) => {
            if(user.userId) {
                usersIn.push(user.userId._id)
            }
        })
    }

    if(questionIds.length && !intialFilterSearchStatus) {
        intialFilterSearchStatus = true
        let questionsArray = []
        questionIds.forEach((item) => {
            let questionsObj = {}
            let questionId = item.questionId
            questionsObj['questionId'] = questionId
                    questionsObj['answers'] = {
                        $in:item.answers
                    }
            questionsArray.push(questionsObj)
        })
        if(exp) {
            userObj = {
                path: 'userId',
                match: {yearsOfExperience: {$gte:exp}},
                select: '_id'
            }
        } 
        if(typeof exp == 'undefined') {
             userObj = {
                path: 'userId',
                select: '_id'
            }
        }
        userIds = await writerKnowledgeModel.find ({$or: questionsArray}, 'user').populate(userObj)
        userIds.forEach((user) => {
            if(user.userId) {
                usersIn.push(user.userId._id)
            }
        })
    }
    if(exp && genre.length == 0 && questionIds.length == 0 && knownLanguages.length == 0 
        && otherKnownLanguages.length == 0 && translateLanguages.length == 0
        && !intialFilterSearchStatus) {
        userIds = await userModel.find({ yearsOfExperience: {$gte: exp}}, '_id');
        userIds.forEach((user) => {
            usersIn.push(user._id)
        })
    }

    // Know Languages
    if(knownLanguages.length && !intialFilterSearchStatus) {
        console.log("knownLanguages", knownLanguages)
        let userExpObj = {};
        let knownLanguagesArray = []

        knownLanguages.forEach((item) => {
            let key  = Object.keys(item);
            let value  = Object.values(item);
            let knownLanguagesObj = {}
            let keyName = `answers.${key[0]}`
            // knownLanguagesObj[keyName] = { $in: value[0]  }
            knownLanguagesObj[keyName] = { $in: value[0]  }
            knownLanguagesArray.push(knownLanguagesObj)
        })
        if(exp) {
            userExpObj = {
                path: 'userId',
                match: {yearsOfExperience: { $gte: exp  }},
                select: '_id'
            }
        } 
        if(typeof exp == 'undefined') {
            userExpObj = {
                path: 'userId',
                select: '_id'
            }
        }
        console.log("99999999999", JSON.stringify(knownLanguagesArray))
        userIds = await knownlanguageModel.find({$or: knownLanguagesArray}, 'user').populate(userExpObj);
        userIds.forEach((user) => {
            // console.log("user.userIduser.userIduser.userId",user.userId)
            if(user.userId) {
                usersIn.push(user.userId._id)
            }
        })
    }

    // other languages
    if(otherKnownLanguages.length && !intialFilterSearchStatus) {
        let userExpObj = {};
        let otherKnownLanguagesArray = []

        otherKnownLanguages.forEach((item) => {
            let otherKnownLanguagesObj = {}
            let key  = Object.keys(item);
            let value  = Object.values(item);
            console.log("item",value);
            console.log("key",key[0])
            value.forEach((item1) => {
            let key1  = Object.keys(item1);
            let value1  = Object.values(item1);
            console.log(key1[0], value1[0])
            otherKnownLanguagesObj[`answers.${key[0]}.${key1[0]}`] = { $in: value1[0]  }
            otherKnownLanguagesArray.push(otherKnownLanguagesObj)
            })
        })
        if(exp) {
            userExpObj = {
                path: 'userId',
                match: {yearsOfExperience: { $gte: exp  }},
                select: '_id'
            }
        } 
        if(typeof exp == 'undefined') {
            userExpObj = {
                path: 'userId',
                select: '_id'
            }
        }
        console.log("otherKnownLanguages",JSON.stringify(otherKnownLanguagesArray))
        userIds = await otherLanguageModel.find({$and:[{"questionText" : "Other known languages"},
        {$or: otherKnownLanguagesArray}]}, 'user').populate(userExpObj).sort({questionNumber:  1});
        userIds.forEach((user) => {
            if(user.userId) {
                usersIn.push(user.userId._id)
            }
        })
    }

    // Translate Languages
    if(translateLanguages.length && !intialFilterSearchStatus) {
        intialFilterSearchStatus = true
        let userObj = {};
        if(exp) {
            userObj = {
                path: 'userId',
                match: {yearsOfExperience: {$gte:exp}},
                select: '_id'
            }
        } 
        if(typeof exp == 'undefined') {
             userObj = {
                path: 'userId',
                select: '_id'
            }
        }
        userIds = await otherLanguageModel.find({$and:[{"questionText" : "I can translate from"},{"answers":{$in: translateLanguages}}]}, 'user').populate(userObj);
        console.log("userIds", userIds.length)
        userIds.forEach((user) => {
            if(user.userId) {
                usersIn.push(user.userId._id)
            }
        })
    }

    usersIn = usersIn.filter((user) => user != req.user.user_id)
    userDetails = await userModel.find({_id: { $in : usersIn}, isWriter: true}).sort({yearsOfExperience: 1})
    for ( userObject of userDetails) {
       const userId = userObject._id;
        let userWriterExpert = []; 
        let userKnowledgeLanguage = [];
        let userTranslateLanguage = [];
        // if gener key exist search for genre
        if(genre.length) {
            
            let genreArray = []
            genre.forEach((item, value) => {
                let key1  = Object.keys(item);
                let value1  = Object.values(item);
                let genreObj = {}
                genreObj[`answers.${key1[0]}`] = { $in: value1[0]  }
                genreArray.push(genreObj)
            })
            userWriterExpert = await writerExpertModel.find({userId: userId, $or: genreArray});
        } else {
            userWriterExpert = await writerExpertModel.find({userId: userId});
        }

        if(questionIds.length) {
            let questionsArray = []
            questionIds.forEach((item) => {
                let questionsObj1 = {}
                let questionId = item.questionId
                questionsObj1['questionId'] = questionId
                    if(typeof v == 'string') {
                        questionsObj1['answers'] = {
                            $in:item.answers
                        }
                    }
                questionsArray.push(questionsObj1)
            })
            userWriterKnowledge = await writerKnowledgeModel.find({userId: userId, $or: questionsArray}).sort({questionNumber:  1});
        } else {
            userWriterKnowledge = await writerKnowledgeModel.find({userId: userId}).sort({questionNumber:  1});
        }

        // Know Languages
        if(knownLanguages.length) {
            let userExpObj = {};
            let knownLanguagesArray = []

            knownLanguages.forEach((item) => {
                let key1 = "answers";
                let key  = Object.keys(item);
                let value  = Object.values(item);
                let knownLanguagesObj = {}
                knownLanguagesObj[`${key1}.${key[0]}`] = { $in: value[0]  }
                knownLanguagesArray.push(knownLanguagesObj)
            })
            userKnowledgeLanguage = await knownlanguageModel.find({userId: userId, $or: knownLanguagesArray});  
        } else {
            userKnowledgeLanguage = await knownlanguageModel.find({userId: userId}) ;
        }

        // other languages
        if(otherKnownLanguages.length) {
            let userExpObj = {};
            let otherKnownLanguagesArray = []
            otherKnownLanguages.forEach((item) => {
                let otherKnownLanguagesObj = {}
                let key  = Object.keys(item);
                let value  = Object.values(item);
                value.forEach((item1) => {
                let key1  = Object.keys(item1);
                let value1  = Object.values(item1);
                console.log(key1[0], value1[0])
                otherKnownLanguagesObj[`answers.${key[0]}.${key1[0]}`] = { $in: value1[0]  }
                otherKnownLanguagesArray.push(otherKnownLanguagesObj)
                })
            })
            userOtherLanguage = await otherLanguageModel.find({userId: userId, "questionText" : "Other known languages", $or: otherKnownLanguagesArray}).sort({questionNumber:  1});
            
        } else {
            // console.log(userId, otherLanguageModel)
            userOtherLanguage = await otherLanguageModel.find({userId: userId, "questionText" : "Other known languages"}).sort({questionNumber:  1});
        }

        // Translate Languages
        if(translateLanguages.length && !intialFilterSearchStatus) {
            intialFilterSearchStatus = true
            let userObj = {};
             
            
            userTranslateLanguage = await otherLanguageModel.find({userId: userId, $and:[{"questionText" : "I can translate from"},{"answers":{$in: translateLanguages}}]}, 'user').populate(userObj);
            
        } else {
            userTranslateLanguage = await otherLanguageModel.find({userId: userId, "questionText" : "I can translate from"});
        }

        // pending
       
        // userKnowledgeLanguage = await knownlanguageModel.find({userId: userId}).sort({questionNumber:  1});
        // userOtherLanguage = await otherLanguageModel.find({userId: userId}).sort({questionNumber:  1});

        let userTermsAndConditions = await termsConditionsModel.find({userId: userId});
        // if(userKnowledgeLanguage.length && userOtherLanguage.length && userWriterExpert.length && userWriterKnowledge.length && userTranslateLanguage.length && userTermsAndConditions.length) { 
        searchedUsers["userProfile"] = userObject.isRegistrationDone ? userObject : [];
        searchedUsers["knownLanguages"] = userKnowledgeLanguage.length > 0 ? userKnowledgeLanguage : [];
        searchedUsers["otherLanguages"] = userOtherLanguage.length > 0 ? userOtherLanguage : [];
        searchedUsers["writerExpertise"] = userWriterExpert.length > 0 ? userWriterExpert : [];
        searchedUsers["writerKnowledge"] = userWriterKnowledge.length > 0 ?  userWriterKnowledge : [];
        searchedUsers["translateLanguages"] = userTranslateLanguage.length > 0 ? userTranslateLanguage : [];
        searchedUsers["termsAndConditions"] = userTermsAndConditions.length > 0 ? userTermsAndConditions : [];
        finalSearchedUsers.push({...searchedUsers, userId});
        // }
    } 
    return res.status(200).json({status:'success', message:customConstants.messages.MESSAGE_WRITER_FOUND, data:finalSearchedUsers});
} catch(e){
    console.log("catch error",e)
}
});

exports.allIndividualWriterDetails = globalException(async (req, res) => {

    const sLimit = !query.sLimit ? 0 : parseInt(query.sLimit, 10);
    const eLimit = !query.eLimit ? 10 : parseInt(query.eLimit, 10);
    const users  = await userModel.skip(sLimit).limit(eLimit);

    return res.status(200).json({user});
});
