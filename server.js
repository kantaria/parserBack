require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const sslConfig = require('./sslConfig');
const parseAndSaveRoute = require('./routes/parseAndSave');
const getDataRoute = require('./routes/getData');

const app = express();
const port = 3000;

app.use(cors(), bodyParser.json());
app.use(parseAndSaveRoute);
app.use(getDataRoute);

const httpsServer = https.createServer(sslConfig, app);
httpsServer.listen(port, () => {
    console.log(`Server listening at https://parser.codetime.am:${port}`);
});
