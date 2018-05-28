module.exports = function (csvString, featureArray) {
    //divide data to row array
    var csvArray = csvString.trim().split("\n");
    csvArray = csvArray.map(k => k.trim().replace(/\"/g, ""));

    //get feature array
    var keyArray = csvArray[0].trim().split(",");
    var json = [];
    var featureArrayLength = featureArray.length
    var em
    //row by row
    for (var rowNum = 1; rowNum < csvArray.length - 1; rowNum++) {
        jsonRow = new Object();
        var rowString = csvArray[rowNum];
        var dataArray = rowString.trim().split(",");

        for (var i = 0; i < featureArrayLength; i++) {
            em = featureArray[i];
            jsonRow[em] = dataArray[keyArray.indexOf(em)];

            if (jsonRow[em] == null || jsonRow[em] == '') {
                return {
                    line: i,
                    feature: em
                }
            }
        }
        json.push(jsonRow);
    }
    return json;
}