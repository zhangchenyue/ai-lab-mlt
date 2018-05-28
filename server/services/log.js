const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-mongodb').MongoDB;

const dbString = process.env.MONGODB_URI || require('../appsettings.json').Database.ConnectString;
expressWinston.requestWhitelist.push('body');

function customRequestFilter(req, propName) {
    if (propName === "headers") {
        return Object.keys(req.headers).reduce(function (filteredHeaders, key) {
            if (key !== "authorization") {
                filteredHeaders[key] = req.headers[key]
            }
            return filteredHeaders
        }, {})
    } else {
        return req[propName]
    }
}

const infoLog = expressWinston.logger({
    transports: [
        // new winston.transports.Console({
        //     json: false,
        //     colorize: true
        // }),
        // new winston.transports.File({
        //     filename: './logs/success.log'
        // }),
        // save to mongodb
        new winston.transports.MongoDB({ db: dbString })
    ],
    requestFilter: customRequestFilter,
    meta: true,
    dynamicMeta: function (req, res) {
        return {
            user: req.user ? req.user.alias.toLowerCase() : null
        }
    },
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    statusLevels: false,
    level: function (req, res) {
        var level = "";
        if (res.statusCode >= 100) { level = "info"; }
        if (res.statusCode >= 400) { level = "error"; }
        return level;
    },
    ignoreRoute: function (req, res) { return false; }
});

const errLog = expressWinston.errorLogger({
    transports: [
        new winston.transports.MongoDB({ db: dbString })
    ],
    requestFilter: customRequestFilter,
    meta: true,
    dynamicMeta: function (req, res) {
        return {
            user: req.user ? req.user.alias.toLowerCase() : null
        }
    },
    msg: "HTTP {{req.method}} {{req.url}} {{err.body.message}}",
    expressFormat: true,
    colorize: true,
    statusLevels: false,
    level: function (req, res) {
        return "error";
    },
    ignoreRoute: function (req, res) { return false; }
})

module.exports = {
    'infoLog': infoLog,
    'errLog': errLog
}