const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');

router.get('/', (req, res) => {
	User
		.find()
		.then((results) => {
			res.send(results);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send(error);
		});
});

router.post('/add', (req, res) => {
	let newUser = new User({
		_id: new mongoose.Types.ObjectId(),
		username: req.body.username,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	});

	newUser
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send(err);
		});
});

module.exports = router;