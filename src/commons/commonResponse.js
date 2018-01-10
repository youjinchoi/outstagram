var messages = require('./messages');

var commonResponse = {};

commonResponse.ok = function(res, result) {
    if (result) {
        return res.json({
            status: "OK",
            result: result
        });
    } else {
        return res.json({
            status: "OK"
        });
    }
}

commonResponse.error = function(res, message) {
    return res.status(500).json({
        status: "ERROR",
        result: {
            code: 9001,
            message: message || messages.SERVER_ERROR
        }
    })
}

module.exports = commonResponse;