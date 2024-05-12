import { createRegion } from 'region-core';
import { apiGetUserMessageList, ConversationMessageList } from '@/api/message';
import { useMemo } from 'react';
import { UserInfo } from '@/region/user';

interface ChatConfig {
    senderId: string;
    receiverId: string;
    conversationId: string;
    targetUserInfo: UserInfo;
}

const currentChatConfigRegion = createRegion<ChatConfig>();
export const useCurrentChatConfig = currentChatConfigRegion.useValue;
export const setCurrentChatConfig = currentChatConfigRegion.set;
export const getCurrentChatConfig = currentChatConfigRegion.getValue;

const messageListMapRegion = createRegion<Record<string, ConversationMessageList>>();
export const useMessageListMap = messageListMapRegion.useValue;
export const setMessageListMap = messageListMapRegion.set;
export const getMessageListMap = messageListMapRegion.getValue;
export const resetMessageListMap = messageListMapRegion.reset;
export const useMessageListMapLoading = messageListMapRegion.useLoading;
export const loadMessageListMap = messageListMapRegion.loadBy(async () => {
    const res = await apiGetUserMessageList();
    return res.code === 200 ? res.data : {};
});
export const useConversationMessageList = (conversationId?: string) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const messageMapList = messageListMapRegion.useValue() ?? {};
    return useMemo(() => {
        if (!conversationId) {
            return {} as ConversationMessageList;
        }
        return messageMapList[conversationId];
    }, [messageMapList, conversationId]);
};
