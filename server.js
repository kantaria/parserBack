const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https'); // Добавляем модуль https

const app = express();
const port = 3000;


// Пути к вашему ключу и сертификату
const privateKey = fs.readFileSync('../../../etc/letsencrypt/archive/parser.codetime.am/privkey1.pem', 'utf8');
const certificate = fs.readFileSync('../../../etc/letsencrypt/archive/parser.codetime.am/cert1.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use(bodyParser.json());

app.post('/save-data', (req, res) => {
    const data = req.body.data;
    fs.writeFile('done.txt', data, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('Data saved to file');
    });
});

// Создаем HTTPS сервер, используя приложение Express и учетные данные SSL
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server listening at https://parser.codetime.am:${port}`);
});
