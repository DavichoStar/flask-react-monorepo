const express = require('express');
const path = require('path');

const indexHTML = path.join(__dirname, 'client', 'dist', 'index.html');
const app = express();

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/', function (req, res) {
  console.log(`[GET] / (${new Date().toLocaleString()}) - ${req.ip}`);
  res.sendFile(indexHTML);
});

app.get('/products', function (req, res) {
  console.log(`[GET] /products (${new Date().toLocaleString()}) - ${req.ip}`);
  res.sendFile(indexHTML);
});

app.get('/about', function (req, res) {
  console.log(`[GET] /about (${new Date().toLocaleString()}) - ${req.ip}`);
  res.sendFile(indexHTML);
});

app.listen(4020);
console.log('Server started on port 4020');
