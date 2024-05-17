'use client';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useCallback, useMemo } from 'react';
import { setCurrentChatConfig, useCurrentChatConfig, useMessageListMap, useMessageListMapLoading } from '@/region/chat';
import { getUserInfo, UserInfo } from '@/region/user';
import { Skeleton } from '@/components/ui/skeleton';
import NoChat from './assets/noChat.svg';
import { getAvatar } from '@/lib/utils';

function LeftPanel() {
    const currentChatConfig = useCurrentChatConfig();
    const messageMapList = useMessageListMap() ?? {};
    const messageMapListLoading = useMessageListMapLoading();

    const onClickCard = useCallback((receiverId?: string, conversationId?: string, targetUserInfo?: UserInfo) => {
        if (!receiverId || !conversationId || !targetUserInfo) {
            return;
        }
        const { userId } = getUserInfo()!;
        setCurrentChatConfig({
            senderId: userId,
            receiverId,
            conversationId,
            targetUserInfo,
        });
    }, []);

    const messageCardList = useMemo(() => {
        const keys = Object.keys(messageMapList);
        const messageList = keys.map((k) => messageMapList[k]);
        return messageList.map(({ conversationId, targetUserInfo }) => {
            const { userId, username } = targetUserInfo;
            return (
                <Card
                    key={conversationId}
                    className={`flex items-center gap-3 h-16 px-3 cursor-pointer hover:bg-gray-100 [&:not(:last-child)]:mb-3 ${userId === currentChatConfig?.receiverId ? 'bg-slate-200 border border-b-gray-600 border-x-gray-500 border-t-gray-400' : ''}`}
                    onClick={() => onClickCard(userId, conversationId, targetUserInfo)}
                >
                    <Avatar>
                        <AvatarImage src={getAvatar(userId)} />
                        <AvatarFallback>{userId}</AvatarFallback>
                    </Avatar>
                    <div>{username}</div>
                </Card>
            );
        });
    }, [currentChatConfig?.receiverId, messageMapList, onClickCard]);

    return (
        <>
            {messageMapListLoading ? (
                <div className='flex flex-col gap-3'>
                    <Skeleton className='h-16 bg-gray-300' />
                    <Skeleton className='h-16 bg-gray-200' />
                    <Skeleton className='h-16 bg-gray-300' />
                    <Skeleton className='h-16 bg-gray-200' />
                    <Skeleton className='h-16 bg-gray-300' />
                    <Skeleton className='h-16 bg-gray-200' />
                    <Skeleton className='h-16 bg-gray-200' />
                </div>
            ) : Object.keys(messageMapList) ? (
                <>{messageCardList}</>
            ) : (
                <NoChat />
            )}
        </>
    );
}

export default LeftPanel;
