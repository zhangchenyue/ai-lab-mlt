// wrapper http error
exports.handleError = (httpStatusCode, error, req, res, next) => {
    var err = new Error();
    err.status = httpStatusCode;
    err.body = error;
    next(err, req, res);
}

exports.AUTH_ERROR_MSG_401 = 'Not authentication! please login';
exports.AUTH_ERROR_MSG_403 = 'You do not have enough rights';
exports.UPLOAD_ERROR_MSG_403 = 'You do not have enough rights to upload';
exports.FILE_ERROR_MSG_400 = 'Bad file id provided';
exports.DELETE_FILE_ERROR_MSG_403 = 'You do not have enough rights to delete';