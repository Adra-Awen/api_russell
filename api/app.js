require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const mongodb = require('./db/mongo');

const path = require('path');

mongodb.initClientDbConnection();

const app = express();

app.use(cors({
    exposedHeaders: ["Authorization"],
    origin: "*"
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);

app.use((req, res) => {
    res.status(404).json({
        name: "API",
        version: "1.0",
        status: 404,
        message: "not_found"
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = app;
