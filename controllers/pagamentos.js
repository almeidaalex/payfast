const logger = require('../services/LoggerService');

module.exports =  app => {

    function saveOnCache(pagamento){
        const memcached = app.services.CacheService();
        memcached.set('pagamento-' + pagamento.id, pagamento, 60000, (err) => {
            console.log(`nova chave adicionada ao cache: ${pagamento.id}`);
        });
    }

    function getFromCache(key, found, notfound){
        const memcached = app.services.CacheService();
        //const logger = app.services.LoggerService();    
        memcached.get('pagamento-' + key, (err, result) => {
            if (err || !result) {
                logger.info(`MISS - Não foi possível encontrar a chave: ${key}`);
                notfound(key);
            } else {
                logger.info(`HIT - A chave foi encontrada: ${key}`);
                found(result);
            }
        });
    }
    
    app.get('/pagamentos', (req, res) => {
        res.send('OK');
    });

    app.get('/pagamentos/pagamento/:id', (req, res) => {
        
        const connection = app.db_api.connectionFactory();
        const pagamentoDao = new app.db_api.PagamentoDao(connection);
        const id = req.params.id;
        
        getFromCache(id, 
            result => { 
                console.log('achou');
                res.send(result);
            },
            key => {
                console.log('não achou');
                pagamentoDao.buscaPorId(key, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        if (result.length === 0)
                            res.status(404).send(result);
                        else
                            res.send(result);
                    }
                });
            }
        );

    });

    app.put('/pagamentos/pagamento/:id', (req, res) => {
        const pgto = {
            id: req.params.id
        };

        console.log('Cheguei no pagamento de cartão');
        const cardService = new app.services.CardService();

        cardService.authorize({}, function (...params) {
            console.log(params.Error);
        });

        res.status(200).send('OK.');
    });

    app.post("/pagamentos/pagamento", (req, res) => {
        const pagamento = req.body;

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

        const errors = req.validationErrors();

        if (errors) {
            console.log('Erros de validação encontrados');
            res.status(400).send(errors);
            return;
        }
        console.log('processando pagamento...');

        const connection = app.db_api.connectionFactory();
        const pagamentoDao = new app.db_api.PagamentoDao(connection);

        pagamento.status = 'CRIADO';
        pagamento.data = new Date();

        pagamentoDao.salva(pagamento, (exception, result) => {
            if (exception) {
                console.log('Deu pau no banco ' + exception);
                res.status(500).send(exception);
            } else {
                
                console.log('pagamento criado: ' + result);
                pagamento.id = result.insertId;
                res.location('/pagamentos/pagamento/' + result.insertId);
                saveOnCache(pagamento);
                res.status(201).json(pagamento);
            }
        });

    });
};