var express = require('express');
var router = express.Router();

//this just returns all users
router.get('/', (req, res) => {
	var db = req.app.locals.db;
	db.collection('users')
		.find()
		.toArray(function(err, results) {
			console.log(results);
			res.send(results);
		});
});

//unfinished
router.get('/:username', (req, res) => {
	var db = req.app.locals.db;
	db.collection('users')
		.find({ 'username': [req.body] })
		.toArray(function(err, results) {
			console.log(results);
			res.send(results);
		});
});

module.exports = router;