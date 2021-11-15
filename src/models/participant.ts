import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'participants' } })
class IParticipant {
    @prop()
    public _id: string;

    @prop({ ref: 'users' })
    public userId: string;

    @prop({ ref: 'rooms' })
    public roomId: string;

    @prop({ required: true ,  default: Date.now() })
    public createdAt:   Date;

    @prop({ required: true ,  default: Date.now() })
    public updatedAt: Date;
}
  
const ParticipantModel = getModelForClass(IParticipant);
export {ParticipantModel, IParticipant}
