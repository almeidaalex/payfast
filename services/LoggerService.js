const winston = require('winston');
const fs = require('fs');


if (!fs.existsSync('logs')){
    fs.mkdirSync('logs');
}

function LoggerService(){
    const logger = winston.createLogger({
        transports:[
            new winston.transports.File({
                level: 'info',
                filename: './logs/payfast.log',
                maxsize: 10000,
                maxFiles: 10,
            }),
            new winston.transports.Console()
        ]
    });
    logger.info('O logger foi criado');
    return logger;
}


module.exports = LoggerService();