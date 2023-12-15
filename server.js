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
    const tableRow = `<tr><td>${data.webSiteLinks}</td><td>${data.currentUrl}</td><td>${data.currentTime}</td><td>${data.companyTitle}</td></tr>\n`;

    // Проверка существует ли файл
    fs.exists('data.html', exists => {
        if (exists) {
            // Добавляем только строку таблицы
            fs.appendFile('data.html', tableRow, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to file');
                }
                res.send('Data added to table');
            });
        } else {
            // Создаем файл с начальной структурой HTML и таблицы, затем добавляем строку
            const initialHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Data Table</title>
    <style>
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        th, td {
            padding: 5px;
            text-align: left;
        }
    </style>
</head>
<body>
    <table>
        <tr>
            <th>Web Site Links</th>
            <th>Current URL</th>
            <th>Current Time</th>
            <th>Company Title</th>
        </tr>
        ${tableRow}
    </table>
</body>
</html>`;
            fs.writeFile('data.html', initialHtml, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error creating file');
                }
                res.send('Table created and data added');
            });
        }
    });
});


// Создаем HTTPS сервер, используя приложение Express и учетные данные SSL
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server listening at https://parser.codetime.am:${port}`);
});
