const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const requestP = require('../../util/request-promise');
const crossPlotJson = require('../../util/plotJson').crossPlotJson;
const handleFileContentFromGridFS$ = require('../../util/common').handleFileContentFromGridFS$;
const csvToJsonFeature = require('../../util/csv2jsonfeature');
const handleError = require('../../middlewares/error').handleError;
const FILE_ERROR_MSG_400 = require('../../middlewares/error').FILE_ERROR_MSG_400;
const serverUrl = require('../../appsettings.json').ComputeEngineURL.learning;

router.post('/', (req, res, next) => {
    let trainFileId;
    let testFileId;
    let benchmarkFileId;
    try {
        trainFileId = ObjectId(req.body.trainFileId);
        testFileId = ObjectId(req.body.testFileId);
        benchmarkFileId = req.body.benchmarkFileId ? ObjectId(req.body.benchmarkFileId) : '';
    }
    catch (e) {
        handleError(400, { message: FILE_ERROR_MSG_400 }, req, res, next);
    }

    Promise.all([
        handleFileContentFromGridFS$(trainFileId),
        handleFileContentFromGridFS$(testFileId),
        handleFileContentFromGridFS$(benchmarkFileId)
    ]).then((doc) => {
        trainCsv = doc[0];
        testCsv = doc[1];
        benchmarkCsv = doc[2];
        //feature name array
        let inputFeatures = req.body.inputFeatures;
        let outputFeatures = req.body.outputFeatures;

        let inputJson = csvToJsonFeature(trainCsv, inputFeatures);
        if (!inputJson instanceof Array) {
            handleError(400, { message: 'Your Train Data Has Null Value On Line ' + inputJson.line + ',' + inputJson.feature + '!' }, req, res, next);
            return
        }
        //output json of train data
        let outputJson = csvToJsonFeature(trainCsv, outputFeatures);
        if (!outputJson instanceof Array) {
            handleError(400, { message: 'Your Train Data Has Null Value On Line ' + outputJson.line + ',' + outputJson.feature + '!' }, req, res, next);
            return
        }

        //test json of test data
        let testJson = csvToJsonFeature(testCsv, inputFeatures)
        if (!testJson instanceof Array) {
            handleError(400, { message: 'Your Test Data Has Null Value On Line ' + testJson.line + ',' + testJson.feature + '!' }, req, res, next);
            return
        }
        let benchmarkJson = []
        if (benchmarkCsv) {
            //divide data to row array
            var benchmarkArray = benchmarkCsv.trim().split('\n');
            //get feature array
            var keyArray = benchmarkArray[0].trim().split(',');
            if (keyArray.indexOf(outputFeatures[0]) == -1) {
                handleError(400, { message: 'Your Benchmark has no feature called ' + outputFeatures[0] + '!' }, req, res, next);
                return
            }
            benchmarkJson = csvToJsonFeature(benchmarkCsv, outputFeatures)
            if (!benchmarkJson instanceof Array) {
                handleError(400, { message: 'Your Benchmark  Has Null Value On Line ' + benchmarkJson.line + ',' + benchmarkJson.feature + '!' }, req, res, next);
                return
            }
            if (testJson.length != benchmarkJson.length) {
                handleError(400, { message: 'Test Data and Benchmark Have Different Size!' }, req, res, next);
                return
            }
        }

        //json sent to MLEngine
        let reqData = {
            in: inputJson,
            out: outputJson,
            test: testJson,
            benchmark: benchmarkJson,
            normalization: req.body.normalization,
            learningrate: req.body.learningrate,
            testratio: req.body.testratio,
            modeltype: req.body.isClassification ? 'Classification' : 'Regression',
            model: req.body.model,
            config: req.body.config
        }

        var currentTime = new Date().getTime();
        requestP.post(serverUrl + 'learning', reqData).then((response) => {
            if (typeof response === 'string') {
                let errmsg = response.match(/<title>(.*)<\/title>/)[1];
                handleError(500, { message: errmsg }, req, res, next);
            } else {
                res.json(handleLearningResponse(response, currentTime, outputFeatures, benchmarkJson, req.body.isClassification));
            }
        });
    }).catch(error => {
        handleError(500, error, req, res, next);
    });
});

function handleLearningResponse(json, time, outputArray, benchmarkJson, isClassification) {
    let responseTime = new Date().getTime() - time;
    var validRealPredictArray = [];
    var length = Object.keys(json.Valid).length
    var valid = json.Valid
    var predict = json.ValidPredict
    for (var i = 0; i < length; i++) {
        validRealPredictArray.push([valid[i], predict[i]]);
    }

    //json.TestPredict : result of test data {'0':'...', '1':'...', ...}
    //testRealPredictArray: test data real-predict pair for cross plot
    var testRealPredictArray = [];
    var length = Object.keys(json.TestPredict).length
    //outputArray now has only one element
    var outputKeyName = outputArray[0]
    var predict = json.TestPredict
    if (benchmarkJson[0] != null) {
        for (var i = 0; i < length; i++) {
            testRealPredictArray.push([benchmarkJson[i][outputKeyName], json.TestPredict[i]]);
        }
    }

    return {
        //pairs for cross plot 
        validRealPredict: validRealPredictArray,
        testRealPredict: testRealPredictArray,
        //score
        validationScore: json.ValidScore,
        testScore: json.TestScore,

        //data for result plot {0:..., 1:..., ...}
        validReal: json.Valid,
        validPredict: json.ValidPredict,
        testPredict: json.TestPredict,
        //[{'Key':...},{'Key':...},...]
        benchmark: benchmarkJson,

        //confusing matrix
        conf_mat_valid: json.ConfMatValid,
        conf_mat_test: json.ConfMatTest,

        //model
        model: json.Model,
        isClassification: isClassification,

        startTime: time,
        responseTime: responseTime

    }
}
module.exports = router;