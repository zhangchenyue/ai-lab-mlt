const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const requestP = require('../../util/request-promise');
const crossPlotJson = require('../../util/plotJson').crossPlotJson;
const handleFileContentFromGridFS$ = require('../../util/common').handleFileContentFromGridFS$;
const csvToJsonFeature = require('../../util/csv2jsonfeature');
const handleError = require('../../middlewares/error').handleError;
const FILE_ERROR_MSG_400 = require('../../middlewares/error').FILE_ERROR_MSG_400;
const serverClusterUrl = require('../../appsettings.json').ComputeEngineURL.cluster;

router.post('/', (req, res, next) => {
    let trainFileId;
    try {
        trainFileId = ObjectId(req.body.trainFileId);
    }
    catch (e) {
        handleError(400, { message: 'bad file id provided' }, req, res, next);
    }

    handleFileContentFromGridFS$(trainFileId)
        .then(csvstr => {
            let inputFeatures = req.body.inputFeatures;
            let inputJson = csvToJsonFeature(csvstr, inputFeatures);
            if (!inputJson instanceof Array) {
                handleError(400, { message: 'Your Train Data Has Null Value On Line ' + inputJson.line + ',' + inputJson.feature + '!' }, req, res, next);
            }
            let reqData = {
                in: inputJson,
                model: req.body.model,
                config: req.body.config
            }
            var currentTime = new Date().getTime();
            requestP.post(serverClusterUrl + 'cluster', reqData).then((response) => {
                if (typeof response === 'string') {
                    let errmsg = response.match(/<title>(.*)<\/title>/)[1];
                    handleError(500, { message: errmsg }, req, res, next);
                } else {
                    res.json(handleClusterResponse(response, currentTime, inputJson, inputFeatures));
                }
            });
        })
        .catch(error => handleError(500, error, req, res, next));
});

function handleClusterResponse(json, time, inputJson, inputArray) {
    let responseTime = new Date().getTime() - time;
    var clusterResult = []
    for (var i in json['0']) {
        clusterResult.push([json['0'][i], json['1'][i], json['2'][i] + 1])
    }

    var downloadCluster = []
    var num = 0;
    for (var i in json['0']) {
        var downloadRow = []
        for (var key in inputJson[0]) {
            downloadRow.push(inputJson[num][key])

        }
        downloadRow.push(json['2'][i] + 1)
        downloadCluster.push(downloadRow)
        num++
    }
    var downloadClusterHeader = inputArray;
    downloadClusterHeader.push('cluster')

    return {
        model: json.Model,
        clusterResult: clusterResult,
        startTime: time,
        responseTime: responseTime,
        downloadCluster: downloadCluster,
        downloadClusterHeader: downloadClusterHeader
    }
}

module.exports = router;