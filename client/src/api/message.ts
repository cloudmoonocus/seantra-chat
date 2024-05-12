import request, { Result } from './http';

export interface Message {
    receiverId: string;
    senderId: string;
    text: string;
    timestamp: number;
}

export interface ConversationMessageList {
    conversationId: string;
    messages: Message[];
    targetUserInfo: {
        userId: string;
        username: string;
        email: string;
        createdTime: number;
    };
}

export interface PostMessage {
    conversationId: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: number;
}

// 获取某个对话的所有消息
export function apiGetConversationMessageList(conversationId: string): Result<ConversationMessageList> {
    return request.get(`/message/getMessage/${conversationId}`);
}

// 获取某个用户的全部消息
export async function apiGetUserMessageList(): Result<Record<string, ConversationMessageList>> {
    return request.get(`/message/getMessagesByUser`);
}
