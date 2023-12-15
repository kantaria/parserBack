/*
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https'); // Добавляем модуль https

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://TestGlide:wChgmoQVw8Uk0ttV@cluster0.nuzhf8j.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const port = 3000;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
// Mongo DB connection finished

// Пути к вашему ключу и сертификату
const privateKey = fs.readFileSync('../../../etc/letsencrypt/archive/parser.codetime.am/privkey1.pem', 'utf8');
const certificate = fs.readFileSync('../../../etc/letsencrypt/archive/parser.codetime.am/cert1.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };
// Certificate complete

app.use(bodyParser.json());

app.post('/save-data', (req, res) => {
    const data = req.body.data;
    const newTableRow = `<tr><td>${data.webSiteLinks}</td><td>${data.currentUrl}</td><td>${data.currentTime}</td><td>${data.companyTitle}</td></tr>\n`;

    fs.readFile('data.html', 'utf8', (err, htmlContent) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Файл не существует, создаем новый
                const initialHtml = createInitialHtml(newTableRow);
                fs.writeFile('data.html', initialHtml, writeErr => handleError(writeErr, res));
            } else {
                // Другая ошибка чтения файла
                console.error(err);
                res.status(500).send('Error reading file');
            }
        } else {
            // Проверяем, существует ли уже такая ссылка
            if (htmlContent.includes(data.webSiteLinks)) {
                res.send('Company already added to the table');
            } else {
                // Файл существует, вставляем новую строку таблицы
                const updatedHtml = insertTableRow(htmlContent, newTableRow);
                fs.writeFile('data.html', updatedHtml, writeErr => handleError(writeErr, res));
            }
        }
    });
});

function createInitialHtml(tableRow) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <title>Parser Content</title>
</head>
<body>
    <table class="table">
    <thead>
        <tr>
            <th scope="col">Web Site Links</th>
            <th scope="col">Current URL</th>
            <th scope="col">Current Time</th>
            <th scope="col">Company Title</th>
        </tr>
        </thead>
        <tbody>
        ${tableRow}
        </tbody>
    </table>
</body>
</html>`;
}

function insertTableRow(htmlContent, tableRow) {
    const closingTableTag = '</tbody></table>';
    const position = htmlContent.lastIndexOf(closingTableTag);
    if (position === -1) {
        throw new Error('Closing table tag not found');
    }
    return htmlContent.slice(0, position) + tableRow + htmlContent.slice(position);
}

function handleError(err, res) {
    if (err) {
        console.error(err);
        res.status(500).send('Error writing file');
    } else {
        res.send('Data added to table');
    }
}




// Создаем HTTPS сервер, используя приложение Express и учетные данные SSL
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server listening at https://parser.codetime.am:${port}`);
});
*/




const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
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

app.use(bodyParser.json());

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
