const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser');
const db = require('./db');
const session = require('express-session');
const vars = require('../config/vars');
const app = express();

process.on('uncaughtException', function (error) {
	console.error(error);
});

app.use(bodyParser.json());

app.get('/connection-test', function (req, res) {
	res.status(200).send(global.dbConnection);
});

app.use('/accounts', require('./routers/accounts'));
app.use('/users', require('./routers/users'));
app.use('/relations', require('./routers/relations'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function(req, res){
    res.redirect('/api-docs');
});

app.use(function (error, req, res, next) {
	console.error(error);
	res.status(503).json({
		status: "ERROR",
		result: error
	});
});

const args = require('yargs').argv;
const port = args.port || 8080;

app.listen(port, function () { 
    console.log('Wepick app listening on port ' + port + '!');
});