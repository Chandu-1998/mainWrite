const mongoose = require('mongoose')

const Subscription = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        // required:[true, 'UserId required.']
    },
    isActive: {           // Flag to track the subscription status (active by default)
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date
    },
    

}, { timestamps: true })

module.exports = mongoose.model("Subscription", Subscription)