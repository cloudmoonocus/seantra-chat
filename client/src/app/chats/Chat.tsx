'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCallback, useMemo, useState } from 'react';
import { setMessageListMap, useConversationMessageList, useCurrentChatConfig } from '@/region/chat';
import { useSocket } from '@/region/socket';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NoMessage from './assets/noMessage.svg';
import { PostMessage } from '@/api/message';
import { cloneDeep } from 'lodash-es';
import { useUserInfo } from '@/region/user';
import { getAvatar } from '@/lib/utils';
import moment from 'moment';
import UserProfileCard from '@/components/UserProfileCard';

function Chat() {
    const socket = useSocket();
    const [message, setMessage] = useState<string>('');
    const currentChatConfig = useCurrentChatConfig();
    const messageMapList = useConversationMessageList(currentChatConfig?.conversationId);
    const userInfo = useUserInfo();

    const onSend = useCallback(() => {
        if (socket && message.trim().length !== 0) {
            const { senderId, receiverId, conversationId } = currentChatConfig!;
            const messageConfig: PostMessage = {
                conversationId,
                senderId,
                receiverId,
                text: message,
                timestamp: Date.now(),
            };
            socket.emit('postMessage', messageConfig);
            setMessageListMap((prevMessageList = {}) => {
                const newMessageList = cloneDeep(prevMessageList);
                newMessageList[conversationId].messages.push(messageConfig);
                return newMessageList;
            });
            setMessage('');
        }
    }, [currentChatConfig, message, socket]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onSend();
            }
        },
        [onSend],
    );

    const messageListShow = useMemo(
        () =>
            [...(messageMapList?.messages ?? [])].reverse().map((message, index) => {
                const isSelf = message.senderId === userInfo?.userId;
                return (
                    <div
                        key={index}
                        className={`flex gap-2 items-start ${isSelf ? 'flex-row-reverse self-end' : 'flex-row self-start'} group`}>
                        <UserProfileCard userId={message.senderId}>
                            <Avatar>
                                <AvatarImage src={getAvatar(message.senderId)} />
                                <AvatarFallback>{isSelf ? message.senderId : message.receiverId}</AvatarFallback>
                            </Avatar>
                        </UserProfileCard>
                        <div className='max-w-xl break-words whitespace-pre-wrap bg-slate-100 px-4 py-2 rounded-lg message'>
                            {message.text}
                        </div>
                        <p className='text-[12px] text-muted-foreground cursor-default select-none hidden group-hover:block'>
                            {moment(message.timestamp).format('HH:mm:ss')}
                        </p>
                    </div>
                );
            }),
        [messageMapList?.messages, userInfo?.userId],
    );

    return (
        <div className='flex-auto flex flex-col h-full'>
            {currentChatConfig ? (
                <>
                    <div className='flex items-center px-6 h-16 border-b border-b-border'>
                        {currentChatConfig?.targetUserInfo.username}
                    </div>
                    <div className='flex-1 flex flex-col-reverse gap-4 px-4 py-8 overflow-auto'>{messageListShow}</div>
                    <div className='flex gap-4 items-center px-6 h-28 border-t border-t-border relative'>
                        <Textarea
                            value={message}
                            className='max-h-24'
                            placeholder='请输入要发送的消息'
                            onChange={(e) => setMessage(e.target.value)}
                            // @ts-ignore
                            onKeyDown={handleKeyDown}
                        />
                        <Button type='submit' className='w-28' onClick={onSend}>
                            发送
                        </Button>
                    </div>
                </>
            ) : (
                <div className='w-2/5 m-auto text-center'>
                    <NoMessage />
                    <div className='font-bold'>你暂时没有要处理的消息 🎉</div>
                </div>
            )}
        </div>
    );
}

export default Chat;
