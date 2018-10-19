const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
var envConfig = require('./config/env.js');

var env = envConfig.get();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

/**
 * this routes all call with starting path "/users" to usersRouter
 */
app.use('/users', usersRouter);
// TODO: add posts routing
// TODO: add session routing
// TODO: add error handling routing

// TODO: implement Promise so don't have to deal with callback functions
mongoose.connect(env.DB_URL, { useNewUrlParser: true });

app.listen(env.PORT, () => {
	console.log(`Diagram API server listening on port ${env.PORT}!`);
});