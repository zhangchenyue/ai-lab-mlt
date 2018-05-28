const express = require('express');
const path = require('path');
const fs = require('fs');
const pageRouter = express.Router();
const pageRoutes = [
    '/',
    '/home',
    '/helloworld',
    '/login',
    '/data',
    '/analysis',
    '/model',
    '/blog',
    '/helpcenter',
    '/documents',
    '/tutorial',
    '/log',
    '/account'
];

pageRoutes.forEach((route) => {
    pageRouter.get(route, (req, res, next) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
});

pageRouter.pageRoutes = pageRoutes;
module.exports = pageRouter;