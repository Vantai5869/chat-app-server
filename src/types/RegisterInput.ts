import { prop, getModelForClass } from '@typegoose/typegoose';
import { Role } from '../models/User';

export class RegisterInput {
    @prop({ required: false })
    public firstName?: string;

    @prop({ required: false })
    public lastName?: string;

    @prop({ required: true })
    public username!: string;

    @prop({ required: true })
    public email!: string;  
    
    @prop({ required: true })
    public password!: string;

    @prop({ required: true })
    public avatar!: string;

    @prop({ enum: Role, required: true, default: [Role.Guest]})
    public role!: Role;

}
