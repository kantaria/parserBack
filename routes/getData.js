const express = require('express');
const client = require('../dbConfig');

const router = express.Router();

router.get('/get-data', async (req, res) => {
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

module.exports = router;
