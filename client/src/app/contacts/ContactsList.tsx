'use client';
import { setContactsListMap, useContactsListMap, useContactsListMapLoading } from '@/region/contacts';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatar } from '@/lib/utils';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { apiDeleteContact } from '@/api/contacts';
import { useToast } from '@/components/ui/use-toast';
import NoContacts from './assets/NoContacts.svg';

export default function ContactsList() {
    const { toast } = useToast();
    const contactsListMap = useContactsListMap() ?? [];
    const loading = useContactsListMapLoading();

    const onDeleteContact = async (userId: string) => {
        const res = await apiDeleteContact(userId);
        if (res.code === 200) {
            toast({ title: '删除成功' });
            setContactsListMap((prev = []) => [...prev].filter((item) => item.userId !== userId));
            return;
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            {loading ? (
                <>
                    <Skeleton className='h-16 bg-gray-300' />
                    <Skeleton className='h-16 bg-gray-200' />
                    <Skeleton className='h-16 bg-gray-300' />
                    <Skeleton className='h-16 bg-gray-200' />
                    <Skeleton className='h-16 bg-gray-300' />
                    <Skeleton className='h-16 bg-gray-200' />
                    <Skeleton className='h-16 bg-gray-200' />
                </>
            ) : contactsListMap.length ? (
                contactsListMap.map(({ userId, username }) => (
                    <ContextMenu key={userId}>
                        <ContextMenuTrigger>
                            <Card className='flex items-center gap-2 px-2 py-3'>
                                <Avatar className='w-[40px] h-[40px]'>
                                    <AvatarImage src={getAvatar(userId)} />
                                    <AvatarFallback className='bg-blue-100'>
                                        {username?.slice(0, 1) ?? ''}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{username}</span>
                            </Card>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem>聊天</ContextMenuItem>
                            <ContextMenuItem onClick={() => onDeleteContact(userId)}>删除好友</ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))
            ) : (
                <div className='flex flex-col gap-2 items-center'>
                    <NoContacts className='w-[90%] h-auto' />
                    <span className='text-xs text-gray-500 select-none'>暂无好友</span>
                </div>
            )}
        </div>
    );
}
