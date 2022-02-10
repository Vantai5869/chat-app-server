import express from 'express';
import cors from 'cors'
import logging from './config/logging';
import userRoutes from './routes/user';
import roomRoutes from './routes/room';
import participantRoutes from './routes/participant';
import messageRoutes from './routes/message';
import friendRoutes from './routes/friend';
import mediaUpload from './routes/mediaUpload';

const fileUpload = require('express-fileupload');
const NAMESPACE = 'APP';

const app = express();
app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));

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

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Khai báo static file
app.use('/public',express.static('public'))

app.get("/healthcheck", (req, res) => res.sendStatus(200));

// router
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/participants', participantRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/media', mediaUpload);
app.use('/api/v1/friends', friendRoutes);


// swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./../swagger.json')
app.use('/v1/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// err handle
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});



export { app };
