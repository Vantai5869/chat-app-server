import {app} from './app'
import * as http from 'http'

const server = http.createServer(app)
const PORT = process.env.PORT || '5000'
server.on('connection',()=>{
    console.log('ss')
})

server.listen(PORT,()=>console.info(`listening port ${PORT}: http://localhost:${PORT}`))