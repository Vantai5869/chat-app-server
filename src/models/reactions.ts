import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'participants' } })
class IReaction {
    @prop()
    public _id: string;

    @prop({required:true })
    public reaction: string;

    @prop({ required: true ,  default: Date.now })
    public createdAt:   Number;

    @prop({ required: true ,  default:  Date.now,  })
    public updatedAt: Number;
}
  
const ReactionModel = getModelForClass(IReaction);
export {ReactionModel, IReaction}
