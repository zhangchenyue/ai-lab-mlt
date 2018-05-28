import json2csv from 'json2csv'

export default function (data, fields, fieldNames, fileName) {
    try {
        let result = json2csv({ data: data, fields: fields, fieldNames: fieldNames, quotes: '' });
        let blob = new Blob(['\uFEFF' + result], { type: 'text/csv' });
        let fName = `${(fileName.replace('.csv', '') || 'file')}.csv`;

        if (window.navigator.msSaveBlob) {
            let csvData = new Blob(blob, { type: 'text/csv' });
            navigator.msSaveBlob(csvData, fName);
        } else {
            let elem = document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = fName;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    } catch (err) {
        console.error(err);
    }
}
