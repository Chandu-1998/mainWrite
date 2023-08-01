const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const termsConditionController = require('../controllers/termsConditionController');
const Auth = require('../middleware/auth');

// authorizations
router.use(Auth.verifyToken);
router.use(Auth.verifyWriterPayment);

router.route('/:userId')
      .post(termsConditionController.createTermsAndConditions)
      .patch(termsConditionController.updateTermsAndConditions)

module.exports = router