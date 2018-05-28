const express = require('express');
const ldapPassport = require('../util/ldap-passport');
const router = express.Router();
const isAdmin = require('../util/common').isAdmin;

router.post('/login', ldapPassport.authenticate('ldapauth', { session: true }), (req, res) => {
    if (req.user) {
        req.user.admin = isAdmin(req.user.alias);
    }
    res.json(req.user)
});


router.post('/logout', (req, res) => {
    req.logout();
    res.send("<h2>You have been logged out.</h2>");
});

router.get('/user', (req, res) => {
    if (req.user) {
        req.user.admin = isAdmin(req.user.alias);
    }
    res.json(req.user)
});

module.exports = router;