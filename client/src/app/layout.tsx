'use client';
import './globals.css';
import React, { useEffect } from 'react';
import MenuSide from '@/components/menuSide';
import { io } from 'socket.io-client';
import { getSocket, setSocket } from '@/region/socket';
import { loadMessageListMap, setMessageListMap } from '@/region/chat';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getToken } from '@/lib/utils';
import { PostMessage } from '@/api/message';
import { cloneDeep } from 'lodash-es';
import { getUserInfo, loadUserInfo } from '@/region/user';
import { useAsyncEffect } from 'ahooks';
import { loadContactsListMap } from '@/region/contacts';

const initSocketIo = () => {
    const { userId } = getUserInfo() ?? {};
    const socket = io('http://localhost:3001');
    socket.on('connect', () => {
        console.log('🔗 socket 连接建立成功！', socket.id);
        socket.emit('join', { userId });
    });
    // 监听来自服务器的消息
    socket.on('message', (messageConfig: PostMessage) => {
        setMessageListMap((prevMessageMap = {}) => {
            const newMessageMapList = cloneDeep(prevMessageMap);
            newMessageMapList[messageConfig.conversationId]?.messages?.push(messageConfig);
            return newMessageMapList;
        });
    });
    return socket;
};

const ChatMain = React.memo(function MainContent({ children }: { children: React.ReactNode }) {
    useAsyncEffect(async () => {
        // 获取用户信息
        await loadUserInfo();
        // 获取消息 map
        await loadMessageListMap();
        // 初始化 socket.io
        const socket = initSocketIo();
        // 获取联系人列表
        await loadContactsListMap();
        setSocket(socket);
    }, []);

    useEffect(() => () => {
        const socket = getSocket();
        socket?.disconnect();
        socket?.offAnyOutgoing();
        socket?.offAny();
    });

    return (
        <>
            <MenuSide />
            {children}
        </>
    );
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        const token = getToken();
        if (!token && pathName !== '/auth') {
            return router.push('/auth');
        }
        if (token && pathName === '/auth') {
            return router.replace('/chats');
        }
    }, [router, pathName]);

    return (
        <html lang='zh'>
            <head>
                <title>Seantra Chat</title>
            </head>
            <body>
                {pathName === '/auth' ? <>{children}</> : <ChatMain>{children}</ChatMain>}
                <Toaster />
            </body>
        </html>
    );
}
