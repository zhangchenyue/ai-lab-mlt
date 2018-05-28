const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const c2j = require('../../util/csv2json');
const histPlotJson = require('../../util/plotJson').histPlotJson;
const requestP = require('../../util/request-promise');
const handleFileContentFromGridFS$ = require('../../util/common').handleFileContentFromGridFS$;
const handleError = require('../../middlewares/error').handleError;
const FILE_ERROR_MSG_400 = require('../../middlewares/error').FILE_ERROR_MSG_400;

router.post('/', (req, res, next) => {
    let fileId = '';
    try {
        fileId = ObjectId(req.body.fileId);
        if (!req.body.feature) {
            handleError(400, { message: 'no feature params provided' }, req, res, next);
        }
    }
    catch (e) {
        handleError(400, { message: FILE_ERROR_MSG_400 }, req, res, next);
    }

    handleFileContentFromGridFS$(fileId)
        .then(csvstr => {
            res.json({ 'in': histPlotJson(csvstr, req.body.feature) });
        })
        .catch(error => handleError(500, error, req, res, next));
});

module.exports = router;