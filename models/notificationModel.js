const mongoose = require('mongoose');

const notification = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: [true, 'UserId required.'],
    index: true,
  },
  
  notifiedFrom: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: [true, 'notifiedFrom userId required.'],
    index: true,
  },

  notifiedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: [true, 'notifiedTo userId required.'],
    index: true,
  },

  comments: {
    type:String
  },

  fcmResponse:{
    type: Array,
    default: []
  },
  
  isRead:{
    type: Boolean,
    default: false
  }


  
},  { timestamps: true });

module.exports = mongoose.model('notification', notification);
