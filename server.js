const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'src' directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve static files from the 'data' directory
app.use('/data', express.static(path.join(__dirname, 'data')));

// Endpoint to serve the index.html file
app.get('/', (req, res) => {
    fs.readFile("./src/index.html", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(404).send('File Not Found');
            console.log(`${req.method} ${req.originalUrl}`);
            return;
        }
        res.send(data);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
