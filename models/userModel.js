const mongoose = require("mongoose");
const validator = require("validator");


const userDevicesSchema = new mongoose.Schema({
  deviceToken: {
    type: String,
    default: '',
    required: [true, 'deviceToken required.'],
  }, // Device token value to get from app
  deviceType: {
    type: String,
    default: '',
    required: [true, 'deviceType required.'],
  }, // Device type like iOS/ android
  deviceId: { type: String, default: '' },
  appVersion: { type: String, default: '' },
  apiKey: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  userId: { type: mongoose.Schema.ObjectId },
  universityId: { type: mongoose.Schema.ObjectId },
  expirationTime: { type: String },
  deviceModel: { type: String, default: '' },
});

var validateEmail = function(email) {
  return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)
};

var validateDateOfBirth = function(dateOfBirth) {
  return !isNaN(dateOfBirth.valueOf())
};

const schema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 30,
    },
    yearsOfExperience: {
      type: Number,
    },
    lastName: {
      type: String,
      required: true,
      max: 30,
    },
    profileName: {
      type: String,
      required: true,
      max: 30,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      min: 10,
    },
    email: {
      type: String,
      required: [true, "Email Id required"],
      message: "{VALUE} is not a valid email",
      validate:[ validateEmail, 'Please fill valid email.'],
      unique: [true, "Email id already taken by other user."],
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate:[ validateDateOfBirth, 'Please fill valid dateOfBirth.'],
      unique: false,
    },
    gender: {
      type: String,
      default: "male",
      required: true,
      enum: {
        values: ["male", "female", "others"],
      },
    },
    profileImage: {
      type: String,
    },
    userVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isWriter: {
      type: Boolean,
      required: true,
      default: false,
    },
    isRequiredWriter: {
      type: Boolean,
      required: true,
      default: false,
    },
    isRegistrationDone: {
      type: Boolean,
      required: true,
      default: false,
    },
    badgeCount: {
      type: Number,
      required: true,
      default: 0
    },
    userDevices: [userDevicesSchema],
  },
  { timestamps: true }  
);
module.exports = mongoose.model("User", schema);
