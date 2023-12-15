const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const client = require('../dbConfig');

const router = express.Router();

router.post('/parse-and-save', async (req, res) => {
    const urls = req.body.urls; // Получение списка URL-адресов для парсинга

    try {
        await client.connect();
        const collection = client.db("TestGlide").collection("your_collection_name");

        const parsePromises = urls.map(url => axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 ...',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        }).then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const titleContent = $('[data-qa="vacancy-title"]').text();
            const salaryContent = $('[data-qa="vacancy-salary-compensation-type-net"]').text();

            if (titleContent && salaryContent) {
                return collection.insertOne({ url, title: titleContent, salary: salaryContent });
            }
        }));

        await Promise.all(parsePromises);

        res.send('Данные успешно добавлены в базу данных');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при обработке запроса');
    } finally {
        await client.close();
    }
});

module.exports = router;
