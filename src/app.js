const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerDef');

const app = express();

const ingestLogs = require('./api/controllers/ingestLogs');
const getLogs = require('./api/controllers/getLogs');



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/ingestLogs', ingestLogs);

app.use('/getLogs', getLogs);




app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
