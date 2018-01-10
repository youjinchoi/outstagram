const express = require('express');
const User = require('../models/user');
const TempAccount = require('../models/tempAccount');
const Account = require('../models/account');
const Relation = require('../models/relation');
const AccessKeyNotFoundError = require('../errors/AccessKeyNotFoundError');
const UserNotFoundError = require('../errors/UserNotFoundError');
const messages = require('../commons/messages');
const getNextSeq = require('../autoIncrement');


const router = express.Router();

router.post('/follow', function(req, res, next) {
	const accessKey = req.get('Access-Key');
	if (!accessKey) {
		throw new AccessKeyNotFoundError(messages.ACCESS_KEY_NOT_FOUND);
	}
	const tempId = req.body.id;
	User.findOne({'accessKey': accessKey})
		.then(user => {
			if (!user) {
				throw new UserNotFoundError(messages.USER_NOT_FOUND);
			}
			return TempAccount.findById(tempId).then(temp => {
				if (!temp) {
					throw new Error('TempAccount not found.');
				}
				return {temp: temp, user: user};
			});
		})
		.then(data => {
			return getNextSeq('account').then(result => {
				data.accountSeq = result.seq;
				return data;
			})
		})
		.then(data => {
			const temp = data.temp;
			const account = new Account();
			account.seq = data.accountSeq;
			account.sId = temp.sId;
			account.type = temp.type;
			account.sKey = temp.sKey;
			account.image = temp.image;
			account.description = temp.description;
			account.title = temp.title;
			account.utl = temp.url;
			account.updateDate = temp.updateDate;
			account.followerCount = 1;
			return account.save().then(account => {
				return {account: account, user: data.user};
			});
		})
		.then(data => {
			const user = data.user;
			const query = {
				$inc: {subscribeCount: 1},
				$push: {subscribeAccounts: data.account.seq}
			};
			return User.findOneAndUpdate({seq: user.seq}, query).then(() => {
				return data;
			});
		})
		.then(data => {
			const relation = new Relation();
			relation.accountSeq = data.account.seq;
			relation.userSeq = data.user.seq;
			relation.updateDate = data.account.updateDate;
			return relation.save();
		})
		.then(relation => {
			res.json({
				status: "OK"
			});
		})
		.catch(next);
});

module.exports = router;