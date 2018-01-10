const mongoose = require('mongoose');
const vars = require('../config/vars');

mongoose.Promise = global.Promise;
mongoose.connect(vars.db.address);
const db = mongoose.connection;
db.on('error', function(){
    console.log('MongoDB Connection Failed!');
});
db.once('open', function() {
	global.dbConnection = 'OK';
    console.log('MongoDB Connected!');
});

module.exports = db;