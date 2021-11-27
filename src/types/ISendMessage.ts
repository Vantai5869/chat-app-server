import { MessageType } from "../models/message";

export interface ISendMessage{
    _id:string,
    userId:{
        _id: string,
        username:string,
        avatar:string
    } ,
    roomId: string,
    content: string,
    type: MessageType,
    createdAt:number,
    updatedAt: number,
    userIds?:string[],
    roomAvatar?: string,
    roomName?: string
}