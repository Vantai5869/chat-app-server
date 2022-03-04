import  jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Role } from '../models/user';

const NAMESPACE = 'Auth';

const meCheck = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token');

    let token = req.headers.authorization?.split(' ')[1];
  
    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            logging.debug(NAMESPACE,'token:',  decoded);
            if (error) {
                return res.status(401).json({
                    message: error,
                    error
                });
            } else {
                res.locals.jwt = decoded;
                if(decoded._id===req.params.id)
                next();
                else{ 
                    console.log('decoded._id')
                    console.log(decoded)
                    console.log('req.params.id')
                    console.log(req.params.id)
                    return res.status(401).json({
                        message: 'Unauthorized'
                    });
                }
            }
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default meCheck;
