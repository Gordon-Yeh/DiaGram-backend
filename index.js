const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
const sessionRouter = require('./routes/sessions.js');
const envConfig = require('./config/env.js');

const env = envConfig.get();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * this routes all call with starting path "/users" to usersRouter
 */
app.use('/users', usersRouter);
// TODO: add posts routing
// TODO: add session routing
app.use('/codes', sessionRouter);
// TODO: add error handling routing

// TODO: implement Promise so don't have to deal with callback functions
mongoose.connect(env.DB_URL, { useNewUrlParser: true });

app.listen(env.PORT, () => {
	console.log(`Diagram API server listening on port ${env.PORT}!`);
});