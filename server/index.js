const express = require('express');
const app = express();

var env = process.env.ENVIRONMENT;

if (['development', 'production'].indexOf(env) == -1) {
    env = 'development';
}

const port = env == 'development' ? 3000 : 80;

app.get('/hello', (req, res) => res.send('Hi, we are Engineers without Doctors!'));

app.listen(port, () => console.log(`Diagram API server listening on port ${port}!`));
