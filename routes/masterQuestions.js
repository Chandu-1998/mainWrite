const express = require('express')
const router = express.Router()
const masterQuestionController = require('../controllers/masterQuestionController');
const Auth = require('../middleware/auth');

router.route('/').post(masterQuestionController.addQuestion);

router.route('/:questionId').get(masterQuestionController.getQuestion)
                 .patch(masterQuestionController.updateQuestion)
                 .delete(masterQuestionController.deleteQuestion);

//router.use(Auth.verifyWriterPayment);
router.route('/').get(masterQuestionController.getAllQuestions);

module.exports = router;