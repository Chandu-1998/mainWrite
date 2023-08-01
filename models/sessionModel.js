const mongoose = require('mongoose');

const session = mongoose.Schema({
  accessToken: {
    type: String,
    required: [true, 'Access token required.'],
    trim: true,
    index: true,
  },
  
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: [true, 'UserId required.'],
    index: true,
  },
  
  
  expirationTime: {
    type: String,
    required: [true, 'Expiration time required.'],
    trim: true,
    index: true,
  },
  deviceUdid: {
    type: String,
    required: [false, 'Device UDID  required.'],
    default: '',
    trim: true,
    index: true,
  },
  deviceModel: {
    type: String,
    required: [false, 'Device model required.'],
    default: '',
    trim: true,
    index: true,
  },
  deviceOS: {
    type: String,
    required: [false, 'Device OS required.'],
    default: '',
    trim: true,
    index: true,
  },
  appVersion: {
    type: String,
    required: [false, 'App version required.'],
    default: '',
    trim: true,
    index: true,
  },
  statusCode: {
    type: Number, 
    required: [true, 'Status Is required.'],
    default: 200,
  },
  
},  { timestamps: true });

module.exports = mongoose.model('session', session);
