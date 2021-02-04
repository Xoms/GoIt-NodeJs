
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv')
const contactsRouter = require('./routes/contacts.routes');

dotenv.config();
const PORT = process.env.PORT || 8080;

class Server {
    start() {
        this.server = express();
        this.initMiddlewares();
        this.initRoutes();
        this.listen();
    }

    initMiddlewares() {
        this.server.use(express.json());
        this.server.use(
            cors({
                origin: '*',
            })
        );
        this.server.use(morgan('tiny'));
    }

    initRoutes() {
        this.server.use('/api/contacts', contactsRouter);
    }

    listen() {
        this.server.listen(PORT, () => {
            console.log('Server is listening on port: ', PORT);
        });
    }
}

const server = new Server();
server.start();
