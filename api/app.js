const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const mongodb = require('./db/mongo');

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(function(req, res, next) {
    res.status(404).json({name:"API", versions: "1.0", status: 404, message: "not_found"})
});

module.exports = app;
