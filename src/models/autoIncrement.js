const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoIncrementSchema = new Schema({
    _id: String,
    seq: Number
});

module.exports = mongoose.model('autoIncrement', autoIncrementSchema);