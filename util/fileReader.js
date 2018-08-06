const fs = require('fs');

fs.readFile('PhotoVAC.jpg', (err, buffer) => {

    console.log('Arquivo lido');
    fs.writeFile('PhotoVAC4.jpg', buffer, (e,r) => {
        console.log('Arquivo gravado');
    });
});