const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const c2j = require('../../util/csv2json');
const requestP = require('../../util/request-promise');
const handleFileContentFromGridFS$ = require('../../util/common').handleFileContentFromGridFS$;
const handleError = require('../../middlewares/error').handleError;
const FILE_ERROR_MSG_400 = require('../../middlewares/error').FILE_ERROR_MSG_400;
const serverUrl = require('../../appsettings.json').ComputeEngineURL.learning;

router.get('/', (req, res, next) => {
    let fileId = '';
    try {
        fileId = ObjectId(req.query.fileId);
    }
    catch (e) {
        handleError(400, { message: FILE_ERROR_MSG_400 }, req, res, next);
    }

    handleFileContentFromGridFS$(fileId)
        .then(csvstr => {
            requestP.post(serverUrl + 'describe', { 'alldata': c2j(csvstr) }).then((response) => {
                if (typeof response === 'string') {
                    let errmsg = response.match(/<title>(.*)<\/title>/)[1];
                    handleError(500, { message: errmsg }, req, res, next);
                } else {
                    res.json(handleStatisticTableResponse(response));
                }
            })
        })
        .catch(error => handleError(500, error, req, res, next));
});


function handleStatisticTableResponse(json) {
    let correlation = json.Correlation;
    let feature = [];
    let data = [];
    let iNum = 0;
    let jNum = 0;
    for (let i in correlation) {
        for (let j in correlation[i]) {
            if (correlation[i][j] != null) {
                feature.push(j);
            }
        }
        if (feature.length != 0) break;
    }
    feature.forEach(function (i) {
        jNum = 0;
        feature.forEach(function (j) {
            data.push([iNum, jNum, correlation[i][j]]);
            jNum++;
        })
        iNum++;
    });

    return {
        Describe: json.Describe,
        feature: feature,
        data: data
    }
}

module.exports = router;