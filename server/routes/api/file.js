const express = require('express');
const stream = require('stream');
const concat = require('concat-stream');
const mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const LineInputStream = require('line-input-stream');
const dal = require('../../services/dal');
const c2j = require('../../util/csv2json');
const isAdmin = require('../../util/common').isAdmin;
const handleFileContentFromGridFS$ = require('../../util/common').handleFileContentFromGridFS$;
const handleError = require('../../middlewares/error').handleError;
const UPLOAD_ERROR_MSG_403 = require('../../middlewares/error').UPLOAD_ERROR_MSG_403;
const FILE_ERROR_MSG_400 = require('../../middlewares/error').FILE_ERROR_MSG_400;
const DELETE_FILE_ERROR_MSG_403 = require('../../middlewares/error').DELETE_FILE_ERROR_MSG_403;
const router = express.Router();
const upload = multer();
const demoUploadUsername = 'demo';

// get total user file list include public files
router.get('/list', (req, res) => {
    dal.db.collection('fs.files').find({ $or: [{ metadata: req.user.alias }, { metadata: demoUploadUsername }] }).toArray().then(doc => {
        res.json(doc);
    }).catch(error => {
        handleError(500, error, req, res, next);
    });
});

// get file content by file ObjectId
router.get('/:id', (req, res, next) => {
    let fileId = '';
    try {
        fileId = ObjectId(req.params.id);
    }
    catch (e) {
        handleError(400, { message: FILE_ERROR_MSG_400 }, req, res, next);
    }

    handleFileContentFromGridFS$(fileId)
        .then(csvstr => res.json(c2j(csvstr)))
        .catch(error => handleError(500, error, req, res, next));
})

// delete file by file ObjectId
router.delete('/:id', (req, res, next) => {
    let fileId = '';
    try {
        fileId = ObjectId(req.params.id);
    }
    catch (e) {
        handleError(400, { message: FILE_ERROR_MSG_400 }, req, res, next);
    }

    let bucket = new mongodb.GridFSBucket(dal.db);
     if (isAdmin(req.user.alias)) {
         bucket.delete(fileId).then(function () {
             res.json({ isDeleted: true });
         }).catch(error => {
             handleError(500, error, req, res, next);
         });
     } else {
        dal.db.collection('fs.files').find({ metadata: req.user.alias, files_id: fileId }).toArray().then(doc => {
            if (!doc || !Object.keys(doc).length) {
                handleError(403, DELETE_FILE_ERROR_MSG_403, req, res, next);
            } else {
                bucket.delete(fileId).then(function () {
                    res.json({ isDeleted: true });
                });
            }
        }).catch(error => {
            handleError(500, error, req, res, next);
        });
     }
})

// upload a single file
router.post('/upload', upload.any(), (req, res, next) => {
    let isUploadDemo = !!req.query.demo;
    if (isUploadDemo && !isAdmin(req.user.alias)) {
        handleError(403, { message: UPLOAD_ERROR_MSG_403 }, req, res, next);
        return;
    }
    let db = dal.db;
    let bucket = new mongodb.GridFSBucket(db);
    let file = req.files[0];
    var bufferStream = new stream.PassThrough();
    var bufferStream2 = new stream.PassThrough();
    var responseData = {
        success: false,
        name: file.originalname
    };
    let options = {
        metadata: isUploadDemo ? demoUploadUsername : req.user.alias
    }
    bufferStream.end(new Buffer(file.buffer));
    bufferStream2.end(new Buffer(file.buffer));
    let uploadStream = bucket.openUploadStream(file.originalname, options);
    bufferStream.pipe(uploadStream)
        .on('finish', () => {
            saveCsvToJson(bufferStream2, uploadStream.id, req, res, next, () => {
                responseData.success = true;
                res.json(responseData);
            });
        })
        .on('error', (error) => {
            handleError(500, error, req, res, next);
        });
});

function saveCsvToJson(stream, fileObjectId, req, res, next, cb) {
    let count = 0;
    let rows = [];
    let header = [];
    let lineStream = LineInputStream(stream);
    lineStream.setEncoding('utf8');
    lineStream.setDelimiter('\n');
    lineStream
        .on('line', (line) => {
            line = line.replace('\r', '');
            if (count === 0) {
                header = line.split(',');
            } else {
                let o = {};
                line.split(',').forEach((v, i) => o[header[i]] = v);
                o._id = fileObjectId.toString() + '_' + count;
                o.fileId = fileObjectId.toString();
                rows.push(o);
            }
            count++;
        })
        .on('end', () => {
            try {
                dal.db.collection('csvfilejson').insertMany(rows);
                if (cb) cb();
            } catch (e) {
                throw e;
            }
        })
        .on('error', (error) => {
            handleError(500, error, req, res, next);
        })
}
module.exports = router;