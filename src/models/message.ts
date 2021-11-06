import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

export enum MessageType {
    MESSAGE="message",
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    PDF = 'pdf',
    WORD = 'word',
    ZIP = 'zip',
    TXT = 'txt',
    CALL = 'call',
    MISSCALL = 'missCall',
}

@modelOptions({ options: { customName: 'messages' } })
class IMessage {
    @prop()
    public _id: string;
    
    @prop({ required: true })
    public userId: string;

    @prop({ required: true })
    public roomId: string;

    @prop({ required: true })
    public content: string;

    @prop({ required: true, default:MessageType.MESSAGE})
    public type: MessageType;

    @prop({ type: String, required: true, default:MessageType.MESSAGE})
    public readBy: [string];

    @prop({ required: true ,  default: new Date })
    public createdAt:   Date;

    @prop({ required: true ,  default: new Date })
    public updatedAt: Date;

}
  
const MessageModel = getModelForClass(IMessage);
export {MessageModel, IMessage}
