const restifyClient = require('restify-clients');

class CardService {
    constructor() {
        this._client = restifyClient.createJsonClient({
            url: 'http://locahost:3001'
        });
    }
    authorize(card, callback) {
        this._client.post('/cards/authorize', card, callback);
    }
}


module.exports = () => CardService;
