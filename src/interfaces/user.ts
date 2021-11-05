import { Document } from 'mongoose';
import { Role } from '../models/user';

export default interface IUser extends Document {
    email: string;
    role: Role;
    password: string;
}
