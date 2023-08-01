const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const writerExpertController = require('../controllers/writerExpertController');
const Auth = require('../middleware/auth');

// authorizations
router.use(Auth.verifyToken);
router.use(Auth.verifyWriterPayment);

router.route('/:userId', verifyToken)
      .post(writerExpertController.createWriterExpertise)
      .patch(writerExpertController.updatewriterExpertise)

module.exports = router