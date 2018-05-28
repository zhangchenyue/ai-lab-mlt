const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const server = require('./index');
const publicPath = path.join(__dirname, 'public');
const errLog = require('./services/log').errLog;

server.use(favicon(publicPath + '/favicon.ico'));
server.use(require('./routes/page'));
server.use(express.static(path.join(publicPath)));

/// catch 404 and forward to error handlersad
server.use(function (req, res, next) {
    var err = new Error();
    err.status = 404;
    err.body = { message: 'Page Not Found' }
    next(err, req, res);
});

// express-winston errorLogger makes sense AFTER the router.
server.use(errLog);

/// error handlers
server.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (err.status == 404) {
        res.status(404).send('404 Page Not found');
    } else {
        console.log(err.status + (err.message || err.body.message) + req.url);
        res.status(err.status).send(err.message || err.body.message);
    }
});

server.set('port', process.env.PORT || 5000);

var spa = server.listen(server.get('port'), '0.0.0.0', () =>
    console.log('server listening on port ' + spa.address().port)
);
