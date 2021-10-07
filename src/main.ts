import {app} from './app'
import http from 'http'
import mongoose from "mongoose";
require('dotenv').config()

const server = http.createServer(app)
const PORT = process.env.PORT || '8080'
server.on('connection',()=>{
    console.log('ss')
})

server.listen(PORT,()=>console.info(`listening port ${PORT}: http://localhost:${PORT}`))
server.on('listening', async () => {
	mongoose.connect(process.env.MONGO_URI);
	mongoose.connection.on('open', () => {
		console.info('Connected to Mongo.');
	});
	mongoose.connection.on('error', (err: any) => {
		console.error(err);
	});
});