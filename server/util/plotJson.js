function crossPlotJson(csvString, featureArray) {

    var inputJson = [];
    var csvArray = csvString.trim().split("\n");
    csvArray = csvArray.map(k => k.trim().replace(/\"/g, ""));

    var keyArray = csvArray[0].trim().split(",");
    var jsonRow = [];
    for (var rowNum = 1; rowNum < csvArray.length - 1; rowNum++) {

        var rowString = csvArray[rowNum];
        var dataArray = rowString.trim().split(",");
        jsonRow = [];
        featureArray.forEach(function (em) {
            jsonRow.push(dataArray[keyArray.indexOf(em.toString().trim())]);
        })
        inputJson.push(jsonRow);
    }
    return inputJson
}

function dataPlotJson(csvString, feature) {

    var inputJson = [];
    var csvArray = csvString.trim().split("\n");
    csvArray = csvArray.map(k => k.trim().replace(/\"/g, ""));

    var keyArray = csvArray[0].trim().split(",");
    var jsonRow = [];
    for (var rowNum = 1; rowNum < csvArray.length - 1; rowNum++) {

        var rowString = csvArray[rowNum];
        var dataArray = rowString.trim().split(",");
        inputJson.push(dataArray[keyArray.indexOf(feature.toString().trim())]);
    }
    return inputJson
}

function histPlotJson(csvString, feature) {

    var inputJson = [];
    var csvArray = csvString.trim().split("\n");
    csvArray = csvArray.map(k => k.trim().replace(/\"/g, ""));

    var keyArray = csvArray[0].trim().split(",");
    var jsonRow = [];
    for (var rowNum = 1; rowNum < csvArray.length - 1; rowNum++) {

        var rowString = csvArray[rowNum];
        var dataArray = rowString.trim().split(",");
        inputJson.push(parseFloat(dataArray[keyArray.indexOf(feature.toString().trim())]));
    }
    return inputJson
}

module.exports.crossPlotJson = crossPlotJson;
module.exports.histPlotJson = histPlotJson;
module.exports.dataPlotJson = dataPlotJson;