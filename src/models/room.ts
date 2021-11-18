import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'rooms' } })
class IRoom {
    @prop()
    public _id:string

    @prop()
    public name: string;

    @prop({ required: true })
    public isPrivate: Boolean;

    @prop({ required: true })
    public createBy: string;

    @prop({ type: [String], ref: 'users' })
    public admins:[string]

    @prop({ required: true ,  default: Date.now })
    public createdAt:   Number;

    @prop({ required: true ,  default:  Date.now,  })
    public updatedAt: Number;

}
  
const RoomModel = getModelForClass(IRoom);
export {RoomModel, IRoom}
