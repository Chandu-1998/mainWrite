const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const globalException = require("../utils/globalException");
const sessionModel = require("../models/sessionModel");
const customConstants = require("../config/constants.json");
const userPhoneNumbers = require("../models/userPhoneNumbersModel");
const paymentTransaction = require("../models/paymentModel");
const Subscription = require('../models/subscriptionModel')


//const AppError = require('../utils/appErrors');
const { sendAuthKeySMSNotification, sendTwilioSMSNotification, getOTP, getJWTToken, getJWTTokenExpireDate, getDummyUserObject } = require('../utils/general');

/**
 * 1. For new users, verify phone number & send OTP.
 * 2. For existed users, reset OTP and status.
 * 3. Send Twilio SMS notification (OTP) to users.
 */
exports.verifyPhoneNumber = globalException(async (req, res) => {
  let { countryCode, phoneNumber } = req.body;

  //phone number validation
  phoneNumber = phoneNumber.toString();
  if (parseInt(phoneNumber.length) !== 10) {
    return res.status(400).json({ status: 'failed', message: 'Invalid phone number.' });
  }

  const verificationCode = getOTP();
  const currentUserPhoneNos = await userPhoneNumbers.find({ phoneNumber: phoneNumber });

  // Reset OTP - existed users.
  if (currentUserPhoneNos[0] && currentUserPhoneNos[0]['phoneNumber'] === phoneNumber) {
    const updateUserPhoneNos = { status: 'in-validated', verificationCode: verificationCode };
    const updatedStory = await userPhoneNumbers.findOneAndUpdate({ phoneNumber: phoneNumber }, updateUserPhoneNos, {
      new: true,
      runValidators: true,
    });


    // Send Auth key SMS
    sendAuthKeySMSNotification(countryCode, phoneNumber, verificationCode)
    return res.status(200).json({
      status: "success",
      message: customConstants.messages.MESSAGE_OTP_SUCCESS,
      data: { phoneNumber: updatedStory },
    });


  }

  // Create OTP - new users.
  else if (currentUserPhoneNos.length <= 0) {
    const userPhoneDetails = await userPhoneNumbers.create({ countryCode, phoneNumber, verificationCode });
    // Send Auth key SMS
    sendAuthKeySMSNotification(countryCode, phoneNumber, verificationCode)
    return res.status(201).json({
      status: "success",
      message: customConstants.messages.MESSAGE_OTP_SUCCESS,
      data: { phoneNumber: userPhoneDetails },
    });
  }

  // Send Twilio SMS
  // sendTwilioSMSNotification(phoneNumber, verificationCode);

});

/**
 * verify OTP
 * Insert dummy data into user collection
 * Update users phone number status with "validated"
 */

exports.verifyOtp = globalException(async (req, res) => {
  const { phoneNumber, verificationCode } = req.body;
  const queryUpdateCondition = { phoneNumber: phoneNumber };
  const queryUpdateValues = { status: "validated", otpVerifiedDate: new Date() };
  const currentUser = await userPhoneNumbers.find({ phoneNumber: phoneNumber, verificationCode: verificationCode });

  const userObject = await User.find({ phoneNumber: phoneNumber });
  const userVerified = userObject.length === 0 ? false : userObject[0].userVerified;
  console.log(req.body);
  if (currentUser.length > 0 && currentUser[0] && currentUser[0]['phoneNumber'] === phoneNumber) {
    if (userVerified) {
      await sessionModel.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userObject[0].userId) }, { statusCode: 440 }, { new: true, runValidators: true });
      await userPhoneNumbers.findOneAndUpdate(queryUpdateCondition, queryUpdateValues);
      await User.updateOne({ phoneNumber: phoneNumber }, { $pull: { userDevices: { deviceToken: req.body.userDevices[0].deviceToken } } });
      await User.updateOne({ phoneNumber: phoneNumber }, {
        $push: {
          userDevices: {
            deviceToken: req.body.userDevices[0].deviceToken,
            deviceType: req.body.userDevices[0].deviceType,
            deviceId: req.body.userDevices[0].deviceId,
            appVersion: req.body.userDevices[0].appVersion,
            apiKey: req.body.userDevices[0].apiKey,
            refreshToken: req.body.userDevices[0].refreshToken,
            deviceModel: req.body.userDevices[0].deviceModel
          }
        }
      }, {
        safe: true,
        multi: false
      }
      );
      const jwtToken = getJWTToken(userObject[0]._id);
      const jwtTokenExpires = getJWTTokenExpireDate(jwtToken);

      req.body.accessToken = jwtToken;
      req.body.userId = userObject[0]._id;
      req.body.expirationTime = jwtTokenExpires.exp;
      const userSession = await sessionModel.create(req.body);
      // console.log(userSession.userId,'///////////////////')

      return res.status(201).json({
        status: "success",
        message: customConstants.messages.MESSAGE_OTP_VERIFIED,
        data: { session: userSession },
      });
    }
    else if (!userVerified) {
      const dummyUserObject = getDummyUserObject(phoneNumber);
      dummyUserObject.userDevices = req.body.userDevices;
      const dummyUser = await User.create(dummyUserObject);
      await userPhoneNumbers.findOneAndUpdate(
        queryUpdateCondition,
        queryUpdateValues
      );

      const jwtToken = getJWTToken(dummyUser._id);
      const jwtTokenExpires = getJWTTokenExpireDate(jwtToken);

      req.body.accessToken = jwtToken;
      req.body.userId = dummyUser._id;
      req.body.expirationTime = jwtTokenExpires.exp;
      const userSession = await sessionModel.create(req.body);
      //console.log(userSession);
      return res.status(201).json({
        status: "success",
        message: customConstants.messages.MESSAGE_OTP_VERIFIED,
        data: { session: userSession },
      });
    }
  }
  else {
    return res.status(200).json({ status: "error", message: customConstants.messages.MESSAGE_OTP_NOT_FOUND });
  }
});

/**
 * User Registration
 */
exports.register = globalException(async (req, res) => {

  const currentUser = await userPhoneNumbers.find({ phoneNumber: req.body.phoneNumber, status: "validated" });
  const userProfile = await User.findById({ _id: mongoose.Types.ObjectId(req.params.userId) });

  //   console.log(currentUser, 'l;dmflksjlkjdlkr///////////////////');

  if (currentUser.length > 0) {
    req.body.userVerified = true;
    req.body.isRegistrationDone = true;
    req.body.isWriter = userProfile.isWriter;
    req.body.isRequiredWriter = userProfile.isRequiredWriter;
    req.body.userDevices = userProfile.userDevices;

    const user = await User.findByIdAndUpdate({ _id: req.params.userId }, req.body, { upsert: true, runValidators: true });

    if (!user)
      return res.status(200).json({ status: "failed", message: customConstants.messages.NOT_FOUND });
    return res.status(200).json({ status: "success", message: customConstants.messages.MESSAGE_USER_REGISTRATION_SUCCESS, data: user });
  }
  else {
    return res.status(200).json({ status: "failed", message: customConstants.messages.NOT_FOUND });
  }
});

exports.getUserProfile = globalException(async (req, res) => {
  console.log(`userId = ${req.params.userId}`);
  const appSettings = { writerPaymentPrice: process.env.PAYMENT_WRITER_COST, requiredWriterPaymentPrice: process.env.PAYMENT_REQUIRED_WRITER_COST };
  const userProfile = await User.findById({ _id: mongoose.Types.ObjectId(req.params.userId) }, { userDevices: 0 });
  updatedUserProfile = delete userProfile.userDevices;
  const userPayments = await paymentTransaction.find({ userId: req.params.userId });
  if (userProfile.isRegistrationDone)
    res.status(200).json({ status: 'success', message: customConstants.messages.MESSAGE_USER_GET, data: { userProfile: userProfile, userPayments: userPayments, appSettings: appSettings } });
  else
    res.status(200).json({ status: 'failed', message: customConstants.messages.MESSAGE_USER_NOT_FOUND });
});


exports.subscriptionAccess = globalException(async (req, res) => {
  try {
    const { userId } = req.params;
    const sub = req.body
    const freeTrailFor = {};
    req.body.isWriter = req.body.freeTrailFor === 'isWriter'  ? freeTrailFor.isWriter = true : false;
    req.body.isRequiredWriter = req.body.freeTrailFor === 'isRequiredWriter' ? freeTrailFor.isRequiredWriter = true : false;
  
    const now = new Date();

    // Find the existing subscription for the user
    const existingSubscription = await Subscription.findOne({ userId });

    if (existingSubscription) {
      // Check if the existing subscription is active
      if (existingSubscription.endDate >= now) {
        return res.json({ status: 'Active', message: 'You already have an active subscription.', startDate: existingSubscription.startDate, endDate: existingSubscription.endDate, data:sub });
      } else {
        // If Subscription has expired
        return res.json({
          status: 'Expired', message: 'Your Free Trail Subscription has expired. Go for premium to continue the service',
          subscription_plan_histroty: [{ name: "Free trial", from: existingSubscription.startDate, to: existingSubscription.endDate }],
          data:sub});
      }
    }

    // Calculate the start and end dates for the new subscription
    const subscriptionDuration = 10 * 60 * 1000
    const startDate = now;
    const endDate = new Date(now.getTime() + subscriptionDuration ); // Two Minutes validity
    var newSubscription = new Subscription({ userId, startDate, endDate, sub, freeTrailFor });
    await newSubscription.save();
    console.log(newSubscription)
    res.json({ status: 'Success', message: `Your 30 days of Subscription created successfully`, 
               subscription_plan_histroty: [{ name: "Free trial", from: startDate, to: endDate }], 
               data:newSubscription});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Subscription failed!', error: error.message });
  }
});



exports.paymentTransaction = globalException(async (req, res) => {
  /*
  const { userId } = req.params;
  const paymentPaidFor = {};
  req.body.isWriter = req.body.paymentPaidFor === 'isWriter' && req.body.paymentStatus === 'success' ? paymentPaidFor.isWriter = true : false;
  req.body.isRequiredWriter = req.body.paymentPaidFor === 'isRequiredWriter' && req.body.paymentStatus === 'success' ? paymentPaidFor.isRequiredWriter = true : false;

  await User.findOneAndUpdate({ _id: userId }, paymentPaidFor);  
  await paymentTransaction.create(req.body); 

  res.status(200).json({ status: "success", message: customConstants.messages.MESSAGE_USER_PAYMENT });

  */

  
  try{
  const { userId } = req.params;
  const paymentPaidFor = {};
  const sub = req.body
  req.body.isWriter = req.body.paymentPaidFor === 'isWriter' && req.body.paymentStatus === 'success' ? paymentPaidFor.isWriter = true : false;
  req.body.isRequiredWriter = req.body.paymentPaidFor === 'isRequiredWriter' && req.body.paymentStatus === 'success' ? paymentPaidFor.isRequiredWriter = true : false;

  const now = new Date();

  // Find the existing subscription for the user
  const existingSubscription = await paymentTransaction.findOne({ userId });     
  console.log(existingSubscription.endDate,'///////////////////////////////////')
  if (existingSubscription) {
    // Check if the existing subscription is active
    if (existingSubscription.endDate >= now) { 
      // console.log(now,'/./././././././. /.')
      return res.json({ status: 'Active', message: 'You already have an active subscription.', startDate: now, endDate: existingSubscription.endDate,  });
    }
    else if( existingSubscription.endDate < now ) {
      // If Subscription has expired
      return res.json({
        status: 'Expired', message: 'Your Subscription has expired.',
        subscription_plan_histroty: [{ name: "Paid Subscription", from: existingSubscription.startDate, to: existingSubscription.endDate }]
        ,data:userId});
    }
    else{
      return res.json({error:"Internal server error"})
    }
  }

  // Calculate the start and end dates for the new Paid Subscription
  const subscriptionDuration = 50
  const startDate = now;
  const endDate = new Date(now.setFullYear(now.getFullYear() + subscriptionDuration, now.getMonth(), now.getDate() )); // 50 Years validity
  // console.log(endDate,'..........')

  const myId = await User.findOneAndUpdate({ _id: userId }, paymentPaidFor);  
  // console.log(myId.userId,'///////////')
  const newSubscription = await paymentTransaction.create({userId,startDate, endDate},req.body);
  console.log(newSubscription)
  res.status(200).json({ status: 'Success', message: `Your Subscription created successfully`, 
             subscription_plan_histroty: [{ name: "Paid Subscription", from: startDate, to: endDate }], 
             data:newSubscription});
  // res.status(200).json({ status: "success", message: customConstants.messages.MESSAGE_USER_PAYMENT });
}
catch(err){
  res.status(500).json({error:"payment failed",err})
}

});


  
