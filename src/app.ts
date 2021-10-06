import * as express from 'express';
import * as cors from 'cors';
import { requestLoggerMiddleware } from './middleware/logger';

const app = express();
app.use(cors());
app.use(requestLoggerMiddleware);

app.use('/',(req: express.Request, res: express.Response)=>{
    res.json({ 
        code:200,
        data:'HELLO PVT'
    })
})
export { app };
