import { prop, getModelForClass } from '@typegoose/typegoose';

export enum Genders {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOW = 'unknow',
}
  
export enum Role {
    Admin = 'admin',
    User = 'user',
    Guest = 'guest',
}

class IUser {
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

    @prop({ required: true })
    public coverPhoto!: string;

    @prop({ required: true })
    public refreshToken!: string;

    @prop({ required: true })
    public isOnline!:   Boolean;

    @prop({ required: true })
    public isBlock!:   Boolean;

    @prop({ required: true ,  default: new Date })
    public lastLogin!:   Date;

    @prop({ required: true ,  default: new Date })
    public createdAt!:   Date;

    @prop({ required: true ,  default: new Date })
    public updatedAt!: Date;

    @prop({ enum: Genders, required: true, default:[Genders.UNKNOW] })
    public gender!: Genders;

    @prop({ enum: Role, required: true, default: [Role.Guest]})
    public role!: Role;

    @prop({ type: String, required: true })
    public languages?: string[];
}
  
const UserModel = getModelForClass(IUser);
export {UserModel, IUser}
