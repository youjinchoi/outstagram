const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const relationSchema = new Schema({
	accountSeq: {type: Number, index: true, required: true},
	userSeq: {type: Number, index: true, required: true},
	updateDate: {type: Date}
});

module.exports = mongoose.model('relation', relationSchema);