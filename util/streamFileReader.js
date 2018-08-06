const fs = require('fs');

fs.createReadStream('PhotoVAC.jpg')
    .pipe(fs.createWriteStream('PhotoVAC1.jpg'))
    .on('finish', () => {
        console.log('Arquivo escrito com stream ' + Date.now);
    });
    