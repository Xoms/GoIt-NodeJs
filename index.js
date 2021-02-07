
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv')
const contactsRouter = require('./routes/contacts.routes');
const mongoose = require('mongoose');

dotenv.config();
const PORT = process.env.PORT || 8080;
const DB_URI = process.env.MONGO_URI;

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

    connectToDb = async () => {
        try {
            await mongoose.connect(DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Database connection successful");
        } catch (err) {
            console.log(err);
            process.exit(1)
        }
    }

    listen() {
        this.server.listen(PORT, () => {
            console.log('Server is listening on port: ', PORT);
        });
    }
}

const server = new Server();
server.start();
