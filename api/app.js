const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catwaysRouter = require('./routes/catways');

const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API du Port Russell',
      version: '1.0.0',
      description: 'Documentation générée automatiquement (utilisateurs, réservvations, catways)',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')], 
};
const swaggerDoc = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(logger('dev'));
app.use(cors({
    exposedHeaders: ["Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '1fg!IPUcwv',
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);

app.use((req, res) => {
    res.status(404).json({
        name: "API",
        version: "1.0",
        status: 404,
        message: "not_found"
    });
});

module.exports = app;