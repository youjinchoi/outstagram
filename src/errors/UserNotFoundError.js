class UserNotFoundError extends Error {
	constructor(...args) {
		super(...args);
		Error.captureStackTrace(this, UserNotFoundError);
	}
}

module.exports = UserNotFoundError;