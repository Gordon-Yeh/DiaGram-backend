const app = require('./app.js');
const envConfig = require('./config/env.js');

const env = envConfig.get();

app.listen(env.PORT, () => {
	console.log(`Diagram API server listening on port ${env.PORT}!`);
});
