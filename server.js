// import express from 'express';
// import * as d3 from 'd3';
// import { JSDOM } from 'jsdom';

// const app = express();

// app.get('/', async (req, res) => {
//     const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
//     let body = d3.select(dom.window.document.querySelector("body"));

//     let data = [1, 2, 3, 4, 5];
//     let p = body.selectAll("p")
//         .data(data)
//         .enter()
//         .append("p")
//         .text((d, i) => `element ${d}, index ${i}`);

//     res.send(body.html());
// });

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Set the port

// Define routes
app.get('/', (req, res) => {
    // return the content of the "./src/index.html" file
    res.sendFile(__dirname + '/src/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
