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
@index({phone:1 }, { unique: true , sparse:true})
class IUser {
    @prop()
    public _id:string

    @prop({required: true})
    public username: string;

    @prop({
        required: false,
        trim:true ,
        sparse:true,
        match: /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })
    public email: string;  
    
    @prop({ required: false, unique: true, sparse:true,default:'', match:/^(84|0[3|5|7|8|9])+([0-9]{8})$/ })
    public phone: string;    

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

    @prop({ required: true ,  default: Date.now })
    public lastLogin:   Number;

    @prop({ required: true ,  default: Date.now })
    public createdAt:   Number;

    @prop({ required: true ,  default:  Date.now,  })
    public updatedAt: Number;

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

    @prop({ default:  Date.now,  })
    public dataOfBirth: Number;
    
    @prop()
    public deviceToken: string;
}
  
const UserModel = getModelForClass(IUser);
export {UserModel, IUser}
