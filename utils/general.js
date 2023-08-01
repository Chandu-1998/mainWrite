const mongoose = require("mongoose");
const customConstants = require("../config/constants.json");
const jwt = require("jsonwebtoken");

exports.sendTwilioSMSNotification = (phoneNumber, verificationCode) => {
  const client = require("twilio")(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );
  if (process.env.NODE_ENV === "development") {
    client.messages.create({
      body: customConstants.messages.MESSAGE_TO_SEND_OTP.replace(
        "{{otp}}",
        verificationCode
      ),
      from: process.env.TWILIO_FROM_PHONE_NUMBER,
      to: phoneNumber,
    });
  }
};
exports.sendAuthKeySMSNotification = async (countryCode, phoneNumber, verificationCode) => {
  const request = require("request");
  let smsMessage = `Use ${verificationCode} is confidential and valid for 5 mins This sms sent by Writer Ayurway ${process.env.SMS_OTP_KEY_ID}`;
  console.log("process.env.SMS_AUTH_KEY",process.env.SMS_AUTH_KEY)
  const data = { 
      authkey: process.env.SMS_AUTH_KEY, 
      sms: smsMessage, 
      mobile: phoneNumber, 
      country_code: countryCode,
      sender: "RAYWPL"
  };
  
  var options = { method: 'GET', url: 'https://api.authkey.io/request', qs: data};
  request(options, function (error, response, body) {
    console.log("SMS Response=", error, body);
      if (error) {
          throw new Error("Error in sending SMS = ", error);
      }
      
      console.log("===================== SMS UP FINAL REQUEST OBJET ================");
      console.log("SMS Response=", response.body);
      console.log("===================== SMS UP FINAL REQUEST END ================");

  });

};

exports.getDummyUserObject = (phoneNumber) => ({
  firstName: "xxx",
  lastName: "xxx",
  profileName: "xxx",
  userVerified: true,
  phoneNumber: phoneNumber,
  email: `${phoneNumber}@xxx.com`,
  dateOfBirth: new Date(),
});

exports.getJWTToken = (userId) =>
  jwt.sign({ user_id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.getJWTTokenExpireDate = (jwtToken) =>
  jwt.verify(jwtToken, process.env.JWT_SECRET);

exports.getOTP = () => Math.floor(1000 + Math.random() * 9000);
