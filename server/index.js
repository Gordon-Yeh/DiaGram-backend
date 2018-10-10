const express = require('express');

const app = express();
const port = 3000;

app.get('/hello', (req, res) => res.send('Hi, we are Engineers without Doctors!'));

app.listen(port, () => console.log(`Diagram API server listening on port ${port}!`));
