import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'participants' } })
class IParticipant {
    @prop()
    public _id: string;

    @prop({ ref: 'users', required:true })
    public userId: string;

    @prop({ ref: 'rooms', required:true })
    public roomId: string;

    @prop({ required: true ,  default: Date.now })
    public createdAt:   Number;

    @prop({ required: true ,  default:  Date.now,  })
    public updatedAt: Number;
}
  
const ParticipantModel = getModelForClass(IParticipant);
export {ParticipantModel, IParticipant}
