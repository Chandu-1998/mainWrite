const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const Auth = require('../middleware/auth');

router.post('/verify-phone-number', userController.verifyPhoneNumber);
router.post('/verify-otp',  userController.verifyOtp);

// authorizations
router.use(Auth.verifyToken);
router.post('/subscription-freetrail/:userId',userController.subscriptionAccess)
router.post('/user-payment/:userId',  userController.paymentTransaction);
router.post('/register/:userId',  userController.register);
router.get('/get-user-profile/:userId',  userController.getUserProfile);

module.exports = router;