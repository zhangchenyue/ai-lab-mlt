/**
 * description: server side framework(node+express)
 */

// lib
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sts = require('strict-transport-security');
const favicon = require('serve-favicon');
const session = require('express-session');
const ldapPassport = require('./util/ldap-passport');
const log = require('./services/log').infoLog;
const errLog = require('./services/log').errLog;
const enableDblog = require('./appsettings.json').EnableDBLog;
const routes = require('./routes');
const publicPath = path.join(__dirname, 'public');

const server = express();
const env = process.env.NODE_ENV || 'development';
server.env = env;

// disable header information
server.disable('x-powered-by');
server.disable('server');

// middleware
server.use(require('compression')()) // must be first!
server.use(logger('dev'));
server.use(session({ secret: 'keyboard cat', saveUninitialized: false, resave: true }));
server.use(sts.getSTS({ 'max-age': { days: 30 } }));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(ldapPassport.initialize());
server.use(ldapPassport.session());

// add routers
if (enableDblog) {
    server.use(log);
}


server.use(routes);
module.exports = server;