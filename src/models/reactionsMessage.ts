import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'participants' } })
class IReactionMessage {
    @prop()
    public _id: string;

    @prop({ ref: 'messages', required:true })
    public messageId: string;

    @prop({ ref: 'reactions', required:true })
    public reactionId: string;

    @prop({ required: true ,  default: Date.now })
    public createdAt:   Number;

    @prop({ required: true ,  default:  Date.now,  })
    public updatedAt: Number;
}
  
const ReactionMessageModel = getModelForClass(IReactionMessage);
export {ReactionMessageModel, IReactionMessage}
