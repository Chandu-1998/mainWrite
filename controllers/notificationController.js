const globalException = require('../utils/globalException');
const customConstants = require("../config/constants.json");
const notifications = require('../models/notificationModel');
const userDetails = require('../models/userModel');
const notification = require('../utils/notifications');

exports.createNotification = globalException(async (req, res) => {
    req.body.userId = req.params.userId;
    const notificationLog = await notifications.create(req.body);
     await notification.pushNotification(notificationLog, function (err,response) {
         return res.status(201).json({status: 'success', message: customConstants.messages.MESSAGE_NOTIFICATION_CREATE});    
    });
    
});

exports.getNotifications = globalException(async (req, res) => {
    // console.log(req.query.userId);
    let finalNotifications = [];
    const query = req.query.userType === 'isRequiredWriter' ? {notifiedFrom : req.query.userId} : {notifiedTo : req.query.userId};
    const notificationsLog = await notifications.find(query);
    // console.log(notificationsLog);
    
    if(notificationsLog.length >0 ){
        for(let i = 0; i < notificationsLog.length ; i++) {
            const filterUserId = req.query.userType === 'isRequiredWriter' ? notificationsLog[i].notifiedTo.toString() : notificationsLog[i].notifiedFrom.toString();
            const individualUserDetails = await userDetails.findById(filterUserId);
            // console.log(individualUserDetails);
            if(individualUserDetails) {
            notificationsLog[i]._doc.userDetails = individualUserDetails;
            notificationsLog[i]._doc.message = req.query.userType === 'isRequiredWriter' ? "You showed interest on " + individualUserDetails.firstName.toUpperCase() + " " + individualUserDetails.lastName.toUpperCase() + " profile." : individualUserDetails.firstName.toUpperCase() + " " + individualUserDetails.lastName.toUpperCase() + " has reviewed your profile.";
            //console.log(notificationsLog[i]);
            finalNotifications.push(notificationsLog[i]);
            } else {
                delete notificationsLog[i];
            }
        }
        return res.status(200).json({status: "success", message: customConstants.messages.MESSAGE_NOTIFICATION_GET, data: finalNotifications});
    }
    else{
        return res.status(200).json({status: "success", message: "No notifications found."});
    }
    
});