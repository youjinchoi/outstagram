const express = require('express');
const User = require('../models/user');
const crypto = require('crypto');
const getNextSeq = require('../autoIncrement');
const commonResponse = require('../commons/commonResponse');
const constants = require('../commons/constants');


const router = express.Router();

router.post('/', function(req, res, next) {
	getNextSeq('user')
		.then(result => {
			const accessKey = crypto.createHash('sha256').update(result.seq.toString()).digest('hex');
			const user = new User();
			user.seq = result.seq;
			user.type = constants.user.GUEST.type;
			user.accessKey = accessKey;
			return user.save();
		})
		.then(user => {
			commonResponse.ok(res, {accessKey: user.accessKey});
		})
		.catch(next);
});

module.exports = router;