require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

// Конфигурация MongoDB
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(cors(), bodyParser.json());

app.post('/parse-and-save', async (req, res) => {
    const urls = req.body.urls; // Получение списка URL-адресов для парсинга

    try {
        await client.connect();
        const collection = client.db("TestGlide").collection("your_collection_name");

        for (const url of urls) {
            const html = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 ...',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                }
            }).then(response => response.data);
            const $ = cheerio.load(html);
            const titleContent = $('[data-qa="vacancy-title"]').text();
            const salaryContent = $('[data-qa="vacancy-salary-compensation-type-net"]').text();

            if (titleContent && salaryContent) {
                await collection.insertOne({ url, title: titleContent, salary: salaryContent });
                console.log(`Данные с ${url} добавлены в базу данных`);
            }
        }

        res.send('Данные успешно добавлены в базу данных');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при обработке запроса');
    } finally {
        await client.close();
    }
});


// Маршрут для получения всех данных
app.get('/get-data', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("TestGlide").collection("your_collection_name");

        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
    } finally {
        await client.close();
    }
});

// Пути к вашему ключу и сертификату
const privateKey = fs.readFileSync('../../../etc/letsencrypt/archive/parser.codetime.am/privkey1.pem', 'utf8');
const certificate = fs.readFileSync('../../../etc/letsencrypt/archive/parser.codetime.am/cert1.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Создаем HTTPS сервер, используя приложение Express и учетные данные SSL
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server listening at https://parser.codetime.am:${port}`);
});
