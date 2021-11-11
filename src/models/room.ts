import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'rooms' } })
class IRoom {
    @prop()
    public _id:string

    @prop({ required: true })
    public name: string;

    @prop({ required: true })
    public isPrivate: Boolean;

    @prop({ required: true })
    public createBy: string;

    @prop({ type: [String], ref: 'users' })
    public admins:[string]

    @prop({ required: true ,  default: new Date })
    public createdAt:   Date;

    @prop({ required: true ,  default: new Date })
    public updatedAt: Date;

}
  
const RoomModel = getModelForClass(IRoom);
export {RoomModel, IRoom}
