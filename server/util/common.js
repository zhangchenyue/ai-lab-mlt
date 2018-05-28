const stream = require('stream');
const mongodb = require('mongodb');
const dal = require('../services/dal');
const concat = require('concat-stream');
const adminGroup = require('../appsettings.json').AdminGroup;

exports.isAdmin = (custom) => {
    if (!custom || typeof (custom) !== 'string') {
        return false;
    }
    return adminGroup.some(it => it.toLowerCase() === custom.toLowerCase());
}


exports.handleFileContentFromGridFS$ = (fileId) => {
    return new Promise((resolve, reject) => {
        let bucket = new mongodb.GridFSBucket(dal.db);
        let downloadStream = bucket.openDownloadStream(fileId);
        let concatStream = concat(opts = { encoding: 'string' }, (s) => resolve(s));
        downloadStream.pipe(concatStream);
        downloadStream.on('error', (err) => reject(err));
    })
}