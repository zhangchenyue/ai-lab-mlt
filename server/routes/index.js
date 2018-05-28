const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.use(require('./login'));
router.use(require('./dblog'));
router.use('/api', auth.userRequired, require('./api'));
module.exports = router;