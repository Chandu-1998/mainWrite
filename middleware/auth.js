const jwt = require("jsonwebtoken");
const sessionModel = require("../models/sessionModel");
const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const customConstants = require("../config/constants.json");
const mongoose = require("mongoose");
const db = require('../config/dbConnection')
db.connect()
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const sessionObject = await sessionModel.find({ accessToken: token });

  if (!token || sessionObject.length <=0) {
    return res.status(403).json({ status: "invalid-token", message: "Invalid token or token expired." });
  }

  if (sessionObject[0].statusCode === 440) {
    return res.status(440).json({ status: "session-expired", message: "Session expired." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(403).json({ status: "invalid-token", message: "Token required." });
  }
  return next();
};


const verifyWriterPayment = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user_id ? decoded.user_id : 0;
  const userProfile = await userModel.findById({_id : mongoose.Types.ObjectId(userId)});
  if(!userProfile.isWriter)
    return res.status(200).json({status:"no-access" , message : customConstants.messages.NO_ACCESS});
  else
    return next();
}

const verifyRequiredWriterPayment = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user_id ? decoded.user_id : 0;
  const userProfile = await userModel.findById({_id : mongoose.Types.ObjectId(userId)})
    if(!userProfile.isWriter && !userProfile.isRequiredWriter)
      return res.status(200).json({status:"no-access" , message : customConstants.messages.NO_ACCESS});
    else
      return next();
  
}

exports.verifyToken = verifyToken;
exports.verifyWriterPayment = verifyWriterPayment;
exports.verifyRequiredWriterPayment = verifyRequiredWriterPayment;