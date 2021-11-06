import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'participants' } })
class IParticipant {
    @prop()
    public _id: string;

    @prop({ required: true })
    public userId: string;

    @prop({ required: true })
    public roomId: string;

    @prop({ required: true ,  default: new Date })
    public createdAt:   Date;

    @prop({ required: true ,  default: new Date })
    public updatedAt: Date;
}
  
const ParticipantModel = getModelForClass(IParticipant);
export {ParticipantModel, IParticipant}
