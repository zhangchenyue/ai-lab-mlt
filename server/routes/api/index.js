const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

router.use('/version', require('./version'));
router.use('/file', auth.userRequired, require('./file'));
router.use('/features', auth.userRequired, require('./features'));
router.use('/statictable', auth.userRequired, require('./static-table'));
router.use('/crossplot', auth.userRequired, require('./crossplot'));
router.use('/histogram', auth.userRequired, require('./histogram'));
router.use('/learning', auth.userRequired, require('./learning'));
router.use('/cluster', auth.userRequired, require('./cluster'));

module.exports = router;
