const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const dal = require('../services/dal');
const isAdmin = require('../util/common').isAdmin;

const DBLOG_ERROR_MSG_403 = 'Sorry, You donot have right to view DB logs!';
const DBLOG_ERROR_MSG_400 = 'Bad log id provided';

router.get('/dblog', (req, res) => {
    if (!req.user || !isAdmin(req.user.alias)) {
        res.status(403).send(DBLOG_ERROR_MSG_403);
    }

    dal.db.collection('log').find({}).toArray().then(logs => {
        res.json(logs);
    }).catch(error => {
        console.log(error)
        res.status(500).send(error)
    });
});


router.get('/dblog/:id', (req, res) => {
    if (!req.user || !isAdmin(req.user.alias)) {
        res.status(403).send(DBLOG_ERROR_MSG_403);
    }

    let logId
    try {
        logId = ObjectId(req.params.id);
    }
    catch (e) {
        res.status(400).send(DBLOG_ERROR_MSG_400);
        return;
    }

    dal.db.collection('log').findOne({ _id: logId }).then(log => {
        res.json(log);
    }).catch(error => {
        console.log(error)
        res.status(500).send(error)
    });
});

router.post('/dblog', (req, res) => {
    if (!req.user || !isAdmin(req.user.alias)) {
        res.status(403).send(DBLOG_ERROR_MSG_403);
    }
    let searchObj = {}
    if (req.body.filters.length && req.body.filters[0].vals[0]) {
        let text = req.body.filters[0].vals[0];
        searchObj = {
            $or: [
                { message: eval('/' + text + '/i') },
                { level: eval('/' + text + '/i') },
                { 'meta.user': eval('/' + text + '/i') },
                { 'req.url': eval('/' + text + '/i') },
                { 'res.statusCode': eval('/' + text + '/i') },
                { 'req.method': eval('/' + text + '/i') }
            ]
        }
    }
    dal.db.collection('log').find(searchObj).count().then(count => {
        let skipCount = (count - req.body.page * req.body.pageSize) > 0 ? count - req.body.page * req.body.pageSize : 0;
        dal.db.collection('log').find(searchObj).skip(skipCount).limit(req.body.pageSize).toArray().then(logs => {
            if (req.body.page && req.body.pageSize) {
                res.json({
                    total: count,
                    pageLog: logs
                });
            } else {
                res.json(logs);
            }
        }).catch(error => {
            console.log(error)
            res.status(500).send(error)
        });
    });
});

module.exports = router;