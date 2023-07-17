const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path=require('path');
const app = express();
const usersRouter = require('./routes/users');
const { check, validationResult } = require('express-validator');
app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use( usersRouter);

app.get('/', function (req, res) {
    res.send('<h1>404 page not found</h1>')
})
app.get('/openApp', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    console.log("your server is running");
});


app.listen(2005);











