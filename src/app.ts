import express from 'express';
import logging from './config/logging';
import userRoutes from './routes/user';
import cors from 'cors'

const NAMESPACE = 'APP';

const app = express();
app.use(cors());

// Log the request 
app.use((req, res, next) => {
    //Log the req
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        // Log the res 
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

// rules
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Parse the body of the request
app.use(express.json());
app.use(express.urlencoded());

app.get("/healthcheck", (req, res) => res.sendStatus(200));

// user router
app.use('/users', userRoutes);

// err handle
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});




export { app };
