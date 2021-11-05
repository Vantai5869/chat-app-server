import { prop, getModelForClass, modelOptions, index } from '@typegoose/typegoose';
import config from '../config/config';

export enum Genders {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOW = 'unknow',
}
  
export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}
export enum Language {
    EN="en",
    VI ='vi'
}

@modelOptions({ options: { customName: 'users' } })
@index({ email: 1 }, { unique: true })
class IUser {
    @prop({ required: false })
    public firstName?: string;

    @prop({ required: false })
    public lastName?: string;

    @prop()
    public username: string;

    @prop({ required: true, unique: true,match: /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })
    public email!: string;  
    
    @prop({ required: true })
    public password!: string;

    @prop({default:`${config.DOMAIN}/public/images/avatar-default.jpg`})
    public avatar: string;

    @prop()
    public coverPhoto: string;

    @prop()
    public refreshToken: string;

    @prop({ required: true ,  default: false })
    public isOnline:   Boolean;

    @prop({ required: true ,  default: false })
    public isBlock:   Boolean;

    @prop({ required: true ,  default: new Date })
    public lastLogin:   Date;

    @prop({ required: true ,  default: new Date })
    public createdAt:   Date;

    @prop({ required: true ,  default: new Date })
    public updatedAt: Date;

    @prop({ enum: Genders, default:Genders.UNKNOW })
    public gender: Genders;

    @prop({ enum: Role, default: Role.USER})
    public role: Role;

    @prop({ type: String, required: true, default:Language.VI })
    public languages?: string;

    @prop({ required: true ,  default: false })
    public verify:   Boolean;

    @prop({ required: true ,  default: true })
    public available:   Boolean;
}
  
const UserModel = getModelForClass(IUser);
export {UserModel, IUser}
