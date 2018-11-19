const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./config/routes.js');
//const testRoutes = require('./config/testRoutes.js');
const envConfig = require('./config/env.js');

const env = envConfig.get();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

// if (env.ENV === 'development') {
// 	app.use('/test', testRoutes);
// }

mongoose.connect(env.DB_URL, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

module.exports = app;
