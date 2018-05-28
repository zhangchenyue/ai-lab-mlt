'use strict'
require('./check-versions')()

const config = require('../config')
process.env.NODE_ENV = 'development';

const app = require(__dirname + '/../../server');
const page = require(__dirname + '/../../server/routes/page');
const express = require(__dirname + '/../../server/node_modules/express');
const opn = require('opn')
const path = require('path')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')


// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const compiler = webpack(webpackConfig)
const devMiddleware = require('webpack-dev-middleware')(compiler, { publicPath: webpackConfig.output.publicPath, quiet: false, stats: { colors: true, modules: false, children: false, chunks: false, chunkModules: false } });
const hotMiddleware = require('webpack-hot-middleware')(compiler, { log: console.log, heartbeat: 2000 });
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)
// rewrite page route to locate it in memory files

page.pageRoutes.forEach((route) => {
  app.get(route, (req, res, next) => { req.url = '/index.html'; next(); });
});

app.get('/helloworld', (req, res, next) => { req.url = '/index.html'; next(); });
// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port;
    var uri = 'http://localhost:' + port;
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    server.timeout = 600000
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
