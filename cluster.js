const cluster = require('cluster');
const os = require('os');
const cpus = os.cpus();

if (cluster.isMaster) {
    cpus.forEach(() => {
        cluster.fork();
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`The cluster [${worker.id}] | process [${worker.process.pid}] desconnected. Restarting`);
        cluster.fork();
    });

    cluster.on('listening', (worker) => {
        console.log(`Thread slave [${worker.id}] | process [${worker.process.pid}]`);
    });
    
} else {
    
    require('./index');
}