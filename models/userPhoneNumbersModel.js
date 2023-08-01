const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
      default: "+91",
      min: 3,
      max: 3,
    },
    phoneNumber: {
      type: String,
      required: [true, "Invalid phone number"],
      unique: true,
      minlength : [9, 'Invalid phone number.'],
      //maxlength : [10, 'Invalid phone number'],

      // min: [10, "Invalid phone number."],
      // max: [10, "Invalid phone number."]
    },
    status: {
      type: String, 
      default : "in-validated",
      enum: {
        values: ["validated", "in-validated", "locked"],
      },
    },
    verificationCode: {
      type: Number,
      unique: true,
      min: 6,
    },
    otpVerifiedDate: {
      type: Date, 
      //default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("userPhoneNumber", schema);
