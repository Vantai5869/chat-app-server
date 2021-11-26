import { prop, getModelForClass } from '@typegoose/typegoose';
import { Role } from '../models/user';

export class RegisterInput {
    @prop({ required: true })
    public username!: string;

    @prop({ required: true })
    public email!: string;  
    
    @prop({ required: true })
    public password!: string;

    @prop({ required: true })
    public avatar!: string;

    @prop({ enum: Role, required: true, default: [Role.USER]})
    public role!: Role;

}
