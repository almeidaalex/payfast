const fs = require('fs');

module.exports = app => {
    app.post('/upload/imagem', (req, res) => {
        console.log('Recebendo a imagem');

        const fileName = req.headers.filename;
        req.pipe(fs.createWriteStream('files/' + fileName))
        .on('finish', () => {
            res.status(204).send('Ok');
        });
    });
};