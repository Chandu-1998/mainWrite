const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController');
const Auth = require('../middleware/auth');

router.use(Auth.verifyToken);
router.use(Auth.verifyRequiredWriterPayment);

router.route('/:userId').post(notificationController.createNotification);
router.route('/').get(notificationController.getNotifications);

module.exports = router;