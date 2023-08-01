const mongoose = require('mongoose');

const payment = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: [true, 'UserId required.'],
    index: true,
  },
  
  paymentTransactionId: {
    type: String,
    // required: [true, 'Payment transactionid required.'],
    trim: true,
  },

  paymentMethod: {
    type: String,
    // required: [true, 'Payment method required.'],
    trim: true,
    max:50,
  },
  
  cardNumber: {
    type: String,
    required: [false, 'Card number optional.'],
    trim: true,
  },

  paymentStatus: {
    type: String,
    default: "pending",
    enum: {
      values: ["success", "failed", "pending"],
    },
  },

  paymentPrice: {
    type: Number,
    required: [true, 'Price required.'],
    default :0,
    trim: true,
  },

  paymentDate: {
    type: Date,
    // required: [true, 'Expiration date required.'],
    trim: true,
  },

  paymentLogs: {
    type: Array,
    default:[],
  },

  paymentExpireDate: {
    type: Date,
    default: new Date(+new Date() + 5110*24*60*60*1000),
    required: [true, 'Expiration date required.'],
    trim: true,
  },
  startDate: {
    type: Date,
    require:true
},
endDate: {
    type: Date,
    require:true
},
  
},  { timestamps: true });

module.exports = mongoose.model('payment', payment);
