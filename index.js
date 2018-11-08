const app = require('./app.js');

app.listen(env.PORT, () => {
	console.log(`Diagram API server listening on port ${env.PORT}!`);
});
