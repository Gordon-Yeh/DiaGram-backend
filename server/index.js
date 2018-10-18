const express = require('express');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const usersRouter = require('./routes/users.js');
var envConfig = require('./config/env.js');

var env = envConfig.get();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

/**
 * this routes all call with starting path "/users" to usersRouter
 */
app.use('/users', usersRouter);

MongoClient.connect(env.DB_URL, { useNewUrlParser: true }, function(err, client) {
	if (err) throw err;
	/**
	 * collection pooling
	 * reference: https://medium.com/@tarkus/how-to-open-database-connections-in-a-node-js-express-app-e14b2de5d1f8
	 * can be used from req.app.locals.db during routing
	 */
	app.locals.db = client.db('DiaGramDB');;
});

app.listen(env.PORT, () => {
	console.log(`Diagram API server listening on port ${env.PORT}!`);
});