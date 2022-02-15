import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'friends' } })
class IFriend {
    @prop()
    public _id: string;

    @prop({ ref: 'users', required:true })
    public userId: string;

    @prop({ ref: 'users', required:true })
    public friendId: string;

    @prop({default:false})
    public accepted: Boolean;

    @prop({ required: true ,  default: Date.now })
    public createdAt:   Number;

    @prop({ required: true ,  default:  Date.now,  })
    public updatedAt: Number;
    
}
  
const FriendModel = getModelForClass(IFriend);
export {FriendModel, IFriend}
