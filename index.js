const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./config/routes.js');
const envConfig = require('./config/env.js');

const env = envConfig.get();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

mongoose.connect(env.DB_URL, { useNewUrlParser: true });

app.listen(env.PORT, () => {
	console.log(`Diagram API server listening on port ${env.PORT}!`);
});
