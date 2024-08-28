import createDebug from 'debug';
import http from 'http';

import app from './app.js';
import config from './configs/app.config.js';

const debug = createDebug('server:server');
const server = http.createServer(app);
// process.env.UV_THREADPOOL_SIZE = os.cpus().length;

const START_SERVER = () => {
    server.on('error', (err) => {
        if (err.syscall !== 'listen') {
            throw err;
        }

        const bind = typeof port === 'string' ? 'Pipe ' + config.server.port : 'Port ' + config.server.port;
        switch (err.code) {
            case 'EACCESS':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
            default:
                throw err;
        }
    });

    server.on('listening', () => {
        const addr = server.address();
        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
        debug('listening on ' + bind);
    });

    server.listen(config.server.port, () => {
        console.log(`### Application is running on port ${config.server.port} ### \n`);
    });
};

START_SERVER();
