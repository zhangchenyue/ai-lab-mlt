const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const c2j = require('../../util/csv2json');
const handleFileContentFromGridFS$ = require('../../util/common').handleFileContentFromGridFS$;
const handleError = require('../../middlewares/error').handleError;
const FILE_ERROR_MSG_400 = require('../../middlewares/error').FILE_ERROR_MSG_400;
const router = express.Router();


// get features from a single file content by file ObjectId
router.get('/', (req, res, next) => {
    let fileId = '';
    try {
        fileId = ObjectId(req.query.fileId);
    }
    catch (e) {
        handleError(400, { message: FILE_ERROR_MSG_400 }, req, res, next);
    }

    handleFileContentFromGridFS$(fileId)
        .then(csvstr => res.json(Object.keys(c2j(csvstr)[0])))
        .catch(error => handleError(500, error, req, res, next));
})

module.exports = router;