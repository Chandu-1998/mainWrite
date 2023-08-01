const express = require('express')
const router = express.Router()
const knownLanguageController = require('../controllers/knownLanguageController');
const Auth = require('../middleware/auth');

// authorizations
router.use(Auth.verifyToken);
router.use(Auth.verifyWriterPayment);

// known language
router.route('/:userId')
      .post(knownLanguageController.createKnownLanguages)
      .patch(knownLanguageController.updateknownLanguages);
module.exports = router;