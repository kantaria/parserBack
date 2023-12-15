const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
