const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../commons/constants').user;

const userSchema = new Schema({
    seq: {type: Number, index:true, unique: true, required: true},
	type: {type: Number, required: true, default: user.GUEST.type},
    email: {type: String, index: true, trim: true, unique: true, required: false, sparse: true},
    password: String,
    accessKey: {type: String, index:true, unique: true, required: true},
    maxSubscribeCount: {type: Number, default: 50},
    subscribeCount: {type: Number, default: 0},
    subscribeAccounts: {type: Array, default: []},
    pushToken: String,
    createDate: {type: Date, default: Date.now},
    lastLoginDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);