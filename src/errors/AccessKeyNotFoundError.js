class AccessKeyNotFoundError extends Error {
	constructor(...args) {
		super(...args);
		Error.captureStackTrace(this, AccessKeyNotFoundError);
	}
}

module.exports = AccessKeyNotFoundError;