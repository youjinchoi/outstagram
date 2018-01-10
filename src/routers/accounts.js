const express = require('express');
const axios = require('axios');
const htmlparser = require('htmlparser2');
const User = require('../models/user');
const Account = require('../models/account');
const TempAccount = require('../models/tempAccount');
const Relation = require('../models/relation');
const AccessKeyNotFoundError = require('../errors/AccessKeyNotFoundError');
const UserNotFoundError = require('../errors/UserNotFoundError');
const messages = require('../commons/messages');
const service = require('../commons/constants').service;


const router = express.Router();

router.get('/', function(req, res, next) {
	const accessKey = req.get('Access-Key');
	if (!accessKey) {
		throw new AccessKeyNotFoundError(messages.ACCESS_KEY_NOT_FOUND);
	}
	const count = req.params.count || 10;
	//const next = req.params.next;
	User.findOne({'accessKey': accessKey})
		.then(user => {
			if (!user) {
				throw new UserNotFoundError(messages.USER_NOT_FOUND);
			}
			
			const query = {userSeq: user.seq};
			/*if (!!next) {
				query.updateDate = { $lt: req.query.next };
			}*/
			return Relation.find(query).sort({updateDate: -1}).limit(count);
		})
		.then(relations => {
			const accountSeqs = [];
			relations.map(relation => {
				accountSeqs.push(relation.accountSeq);
			})
			const query = {
				seq: {$in: accountSeqs}
			}
			return Account.find(query);
		})
		.then(accounts => {
			res.json({
				status: "OK",
				result: accounts
			});
		})
		.catch(next);
});

router.get('/search', function(req, res) {
	const id = req.query.id;
	const type = req.query.type || service.INSTAGRAM.type;
	const account = {};
	const parser = new htmlparser.Parser({
		onopentag: function(name, attribs){
			if(name === "meta"){
				const property = attribs.property;
				const content = attribs.content;
				if (property === "og:image") {
					account.image = content;
				} else if (property === "og:title") {
					account.title = content;
				} else if (property === "og:description") {
					account.description = content;
				} else if (property === "og:url") {
					account.url = content;
				}
			}
		},
		ontext: function(text){
			if (text.indexOf("window._sharedData") == 0) {
				const data = JSON.parse(text.replace("window._sharedData = ","").replace(";",""));
				account.sKey = data.entry_data.ProfilePage[0].user.id;
				account.isPrivate = data.entry_data.ProfilePage[0].user.is_private;
				account.updateDate = data.entry_data.ProfilePage[0].user.media.nodes[0].date;
			}
		}
	}, {decodeEntities: true});

	const accessKey = req.get('Access-Key');
	if (!accessKey) {
		throw new AccessKeyNotFoundError(messages.ACCESS_KEY_NOT_FOUND);
	}
	User.findOne({'accessKey': accessKey})
		.then(user => {
			if (!user) {
				throw new UserNotFoundError(messages.USER_NOT_FOUND);
			}

			return Account.findOne({sId: id, type: type});
		})
		.then(accountFromDB => {
			if (!!accountFromDB) {
				res.json({
					status: "OK",
					result: accountFromDB
				});
			} else {
				const url = getUrlByType(id, type);
				return axios.get(url)
					.then(response => {
						parser.write(response.data);
						parser.end();
						if (!!account.isPrivate) {
							res.json({
								status: "OK",
								result: account
							});
						} else {
							const temp = new TempAccount();
							temp.type = type;
							temp.sId = id;
							temp.sKey = account.sKey;
							temp.image = account.image;
							temp.title = account.title;
							temp.description = account.description;
							temp.url = account.url;
							temp.isPrivate = account.isPrivate;
							temp.updateDate = account.updateDate;
							return temp.save().then(temp => {
								res.json({
									status: "OK",
									result: temp
								});
							})
						}
					});
			}
		})
		.catch(error => {
			if (error && error.response) {
				const status = error.response.status;
				if (status == 404) {
					res.json({
						status: "OK",
						result: null
					});
					return;
				}
			}
			res.status(401).json({
				status: "ERROR"
			});
		});
});

getUrlByType = function(id, type) {
	switch(type) {
		case service.INSTAGRAM.type:
			return "https://www.instagram.com/" + id;
		default :
			throw new Error('Type is not matched.');
	}
}

module.exports = router;