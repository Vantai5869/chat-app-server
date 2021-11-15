import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

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
    INFO='info'
}

@modelOptions({ options: { customName: 'messages' } })
class IMessage {
    @prop()
    public _id: string;
    
    @prop({ ref: 'users' })
    public userId: string;

    @prop( { ref: 'rooms' })
    public roomId: string

    @prop({ required: true })
    public content: string;

    @prop({ required: true, default:MessageType.MESSAGE})
    public type: MessageType;

    @prop({ type: [String], ref: 'users' })
    public readBy:[string]

    @prop({ required: true ,  default: new Date })
    public createdAt:   Date;

    @prop({ required: true ,  default: new Date })
    public updatedAt: Date;

}
  
const MessageModel = getModelForClass(IMessage);
export {MessageModel, IMessage}
