const errorDetectingSeparator = 'We could not detect the separator.',
    errorEmpty = 'Please upload a file or type in something.',
    errorEmptyHeader = 'Could not detect header. Ensure first row cotains your column headers.',
    separators = ',';

function CSVtoArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ',';
    // Create a regular expression to parse the CSV values.
    let objPattern = new RegExp(
        (
            // Delimiters.
            '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

            // Quoted fields.
            '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +

            // Standard fields.
            '([^\\' + strDelimiter + '\\r\\n]*))'
        ),
        "gi"
    );
    let arrData = [[]];
    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            arrData.push([]);
        }

        var strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
}

module.exports = function (csv, options) {
    options || (options = {});
    if (csv.length == 0) throw errorEmpty;
    let separator = options.separator;
    let a = CSVtoArray(csv, separator);
    if (!a) throw errorEmpty;

    let keys = a.shift();
    if (keys.length == 0) throw errorEmptyHeader;
    keys = keys.map((key) => key.trim());

    let json = [];
    for (let l = 0; l < a.length; l++) {
        let row = {};
        for (let i = 0; i < keys.length; i++) {
            let val = a[l][i] || '';
            row[keys[i]] = val.trim();
        }
        json.push(row);
    }
    return json;
};