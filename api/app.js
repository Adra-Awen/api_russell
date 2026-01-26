const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catwaysRouter = require('./routes/catways');

const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

app.use(logger('dev'));
app.use(cors({
    exposedHeaders: ["Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res) => {
    res.status(404).json({
        name: "API",
        version: "1.0",
        status: 404,
        message: "not_found"
    });
});

module.exports = app;