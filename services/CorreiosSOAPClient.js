const soap = require('soap');

class CorreiosSOAPClient {
    constructor(){
        this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
    }

    calculateDaysToDelivery(deliveryData, callback) {
        this._soap = soap.createClient(this._url,
            (ex, client) => {
                console.log('cliente SOAP criado'); 
                client.CalcPrazo(deliveryData, callback);            
            });
    }
}

module.exports = () => CorreiosSOAPClient;
