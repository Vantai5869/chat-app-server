import http from 'http';
import mongoose from "mongoose";
import { app } from './app';
import config from './config/config';
import logging from './config/logging';
import SocketServer from './SocketServer';
require('dotenv').config()
const NAMESPACE = 'Server';
const server = http.createServer(app)
const { Server } = require("socket.io")
export const io = new Server(server, { 
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || '8080'
server.on('connection',()=>{
    console.log('connection '+PORT)
})

server.listen(PORT,()=>console.info(`listening port ${PORT}: http://localhost:${PORT}`))
server.on('listening', async () => {
	mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });
	mongoose.connection.on('open', () => {
		console.info('Connected to Mongo.');
	});
	mongoose.connection.on('error', (err: any) => {
		console.error(err);
	});
});

io.on("connection", (socket) => {
  SocketServer(socket)
});