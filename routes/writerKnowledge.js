const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const writerKnowledgeController = require('../controllers/writerKnowledgeController');
const Auth = require('../middleware/auth');

// authorizations
router.use(Auth.verifyToken);
router.use(Auth.verifyWriterPayment);

router.route('/:userId', verifyToken)
      .post(writerKnowledgeController.createWriterKnowledge)
      .patch(writerKnowledgeController.updateWriterKnowledge);

module.exports = router