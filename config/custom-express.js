const express = require('express');      
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const logger = require('../services/LoggerService');
const morgan = require('morgan');

module.exports = () =>{
    var app = express();

    app.use(morgan('short',{
        stream : {
            write: (message) => logger.info(message)
        }
    }));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressValidator());

    consign()
        .include('controllers')
        .then('db_api')
        .then('services')
        .into(app);

    return app;
};

