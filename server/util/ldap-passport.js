const ldapPassport = require('passport');
const ldapStrategy = require('passport-ldapauth');
const basicAuth = require('basic-auth');

let options = {
    server: {
        url: 'LDAPS://ldap.slb.com',
        searchBase: 'o=slb,c=an',
        searchFilter: '(alias={{username}})',
        tlsOptions: {
            rejectUnauthorized: false
        }
    },
    credentialsLookup: basicAuth
};
ldapPassport.serializeUser((user, done) => {
    done(null, user);
});
ldapPassport.deserializeUser((user, done) => {
    done(null, user);
});

ldapPassport.use(new ldapStrategy(options, (user, done) => {
    done(null, user);
}));

module.exports = ldapPassport;