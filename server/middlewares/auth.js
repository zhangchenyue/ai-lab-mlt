const adminGroup = require('../appsettings.json').AdminGroup;
const error = require('./error');
const isAdmin = require('../util/common').isAdmin;

// need member right
exports.userRequired = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        error.handleError(401, error.AUTH_ERROR_MSG_401, req, res, next);
    } else {
        next();
    }
}

//need admin right
exports.adminRequired = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        error.handleError(401, error.AUTH_ERROR_MSG_401, req, res, next);
    } else {
        if (!req.user || !isAdmin(req.user.alias)) {
            error.handleError(403, error.AUTH_ERROR_MSG_403, req, res, next);
        } else {
            next();
        }
    }
};

