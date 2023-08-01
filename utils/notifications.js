const FCM = require('fcm-node');
const async = require("async");
const mongoose = require("mongoose");
const userDetails = require("../models/userModel");
const notifications = require("../models/notificationModel");
    
var utility = {};
const fcm_key = process.env.FIREBASE_PUSH_KEY;
console.log("fcm_key",fcm_key)
const fcm = new FCM(fcm_key);


exports.pushNotification = async (notificationLog, cb) => {
  const { notifiedFrom, notifiedTo, comments, userId, _id } = notificationLog;
 // send push to writer from the required writer.
 const writerDetails = await userDetails.findById(notifiedTo);
 const searchWriterDetails = await userDetails.findById(notifiedFrom);

  const msg =
    searchWriterDetails.firstName +
    " " +
    searchWriterDetails.lastName +
    " has showed intrest on your profile.";
  var dispMsg = msg.replace(/<[^>]+>/g, ' ').trim();
  // dispMsg = (dispMsg.length > 45) ? dispMsg.substring(0, 45) + '...' : dispMsg;
  let promises=[];
  const deviceData = writerDetails.userDevices;
  const badgeCount = writerDetails?.badgeCount || 0;
  deviceData.map((eachDeviceData)=>{
      promises.push(new Promise(async(resolve,reject)=>{
          if (eachDeviceData.deviceType == 'android' || eachDeviceData.deviceType == 'Android'){
              var message = {
                  content_available: false,
                  priority: "high",
                  to: eachDeviceData.deviceToken,
                  data: {
                      notifiData: {
                          title: "TheWriter",
                          body: dispMsg,
                          // body: attach.data,
                          notificationType: 1,
                          click_action: 1,
                          foreground: true,
                          badge: parseInt(badgeCount) + 1,
                          data: comments,
                          sound: "default"
                      },
                      reqObj:comments
                  }
              };
          }
          else {
              var message = {
                  content_available: false,
                  priority: "high",
                  to: eachDeviceData.deviceToken,
                  notification: {
                      title: "TheWriter",
                      body: dispMsg,
                      // body: attach.data,
                      notificationType: 1,
                      click_action: 1,
                      foreground: true,
                      badge: parseInt(badgeCount) + 1,
                      message_type: comments,
                      sound: "default"
                  },
                  message_type: comments
              };
          }
          const response= await sendMessage(message)
          let fcmResponse = {
              device_token: eachDeviceData.deviceToken,
              device_type: eachDeviceData.deviceType,
              fcm_response: response
          };       
          resolve(fcmResponse)
      }))
      
  })

  Promise.all(promises).then( async (finalresponse)=>{
     await notifications.updateOne({_id: mongoose.Types.ObjectId(notificationLog._id)},{fcmResponse: finalresponse});
     await userDetails.updateOne({_id: mongoose.Types.ObjectId(notificationLog.notifiedTo)},{badgeCount: parseInt(badgeCount) + 1})
    cb(null, finalresponse)
  }).catch(error=>{
    cb(error,null) 
  })  
}

function sendMessage(message){
  return new Promise((resolve,reject)=>{
    try {
      fcm.send(message, function(err, response) {
          if (err) {
              resolve(err)
          } else {
              resolve(response)
          }
      });
    } catch (e) {
      console.log(e); // Logs the error
    }



      
  })
}

