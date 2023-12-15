const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const cors = require('cors'); // Импорт пакета CORS
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

// Замените это своими данными MongoDB
const uri = "mongodb+srv://TestGlide:wChgmoQVw8Uk0ttV@cluster0.nuzhf8j.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
app.use(cors(), bodyParser.json());


app.post('/save-data', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("TestGlide").collection("your_collection_name");

        const data = req.body.data;
        const existingData = await collection.findOne({ webSiteLinks: data.webSiteLinks });

        if (existingData) {
            res.send('Company already added to the database');
        } else {
            await collection.insertOne(data);
            res.send('Data added to the database');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
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
