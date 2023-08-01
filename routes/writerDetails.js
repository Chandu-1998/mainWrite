const express = require('express')
const router = express.Router();
const writerController = require('../controllers/writerController');
const Auth = require('../middleware/auth');

// authorizations
router.use(Auth.verifyToken);

//router.use(Auth.verifyRequiredWriterPayment);
router.route('/search-writers').post(Auth.verifyRequiredWriterPayment, writerController.searchWriters);

router.use(Auth.verifyWriterPayment);
router.route('/individual-writer-details').get(writerController.getIndividualWriterDetails);

module.exports = router;