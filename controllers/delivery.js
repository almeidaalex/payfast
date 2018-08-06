const logger = require('../services/LoggerService');

module.exports = (app) => {
    app.post('/delivery/days-calculator', (req, res) =>{
        const deliveryData = req.body;

        const correiosSOAPClient = new app.services.CorreiosSOAPClient();

        correiosSOAPClient.calculateDaysToDelivery(deliveryData, (err, result) => {
               
            if (err){
                res.status(500).send(err);
                return;
            }

            logger.info(result);
            res.send(result);
        });
    });
};