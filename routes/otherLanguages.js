const express = require('express')
const router = express.Router()
const otherLanguageController = require('../controllers/otherLanguageController');
const Auth = require('../middleware/auth');

// authorizations
router.use(Auth.verifyToken);
router.use(Auth.verifyWriterPayment);

// known language
router.route('/:userId')
      .post(otherLanguageController.createOtherLanguages)
      .patch(otherLanguageController.updateOtherLanguages);
module.exports = router;