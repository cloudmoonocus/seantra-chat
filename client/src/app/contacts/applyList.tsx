'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatar } from '@/lib/utils';
import { apiGetUserInfo } from '@/api/user';
import { UserInfo } from '@/region/user';
import { Skeleton } from '@/components/ui/skeleton';
import { apiAgreeContact, apiGetApplyList, apiRejectContact } from '@/api/contacts';
import { useToast } from '@/components/ui/use-toast';
import { BellIcon } from '@radix-ui/react-icons';
import NoResult from './assets/noResult.svg';
import { loadContactsListMap } from '@/region/contacts';

export default function ApplyList() {
    const { toast } = useToast();
    const [applyList, setApplyList] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getContactsList = async () => {
        const { code, data } = await apiGetApplyList();
        if (code === 200) {
            const res = await Promise.all(data.map(apiGetUserInfo));
            setApplyList(res.map((data) => data.data));
        }
        setLoading(false);
    };

    const handleOperate = async (contactId: string, flag: boolean = true) => {
        const res = flag ? await apiAgreeContact(contactId) : await apiRejectContact(contactId);
        if (res.code === 200) {
            toast({ title: flag ? '🎉 恭喜成为好友' : 'o(￣ヘ￣o＃) 拒绝成功' });
            setApplyList((applyList) => [...applyList].filter(({ userId }) => contactId !== userId));
            flag && (await loadContactsListMap());
            return;
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant='outline' className='w-full' onClick={getContactsList}>
                    <BellIcon className='mr-2' />
                    申请列表
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>好友申请</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-3'>
                    {loading ? (
                        <>
                            <div className='flex items-center gap-3 box-content h-[40px] px-4 py-2'>
                                <Skeleton className='h-[40px] w-[40px] rounded-full bg-gray-300' />
                                <Skeleton className='h-[25px] flex-[4] bg-gray-300' />
                                <Skeleton className='h-[25px] flex-1 bg-gray-300' />
                                <Skeleton className='h-[25px] flex-1 bg-gray-300' />
                            </div>
                            <div className='flex items-center gap-3 box-content h-[40px] px-4 py-2'>
                                <Skeleton className='h-[40px] w-[40px] rounded-full bg-gray-400' />
                                <Skeleton className='h-[25px] flex-[4] bg-gray-400' />
                                <Skeleton className='h-[25px] flex-1 bg-gray-400' />
                                <Skeleton className='h-[25px] flex-1 bg-gray-400' />
                            </div>
                        </>
                    ) : applyList.length ? (
                        applyList.map(({ userId, username }) => (
                            <Card key={userId} className='flex items-center gap-3 box-content h-[40px] px-4 py-2'>
                                <Avatar className='w-[40px] h-[40px]'>
                                    <AvatarImage src={getAvatar(userId)} />
                                    <AvatarFallback className='bg-blue-100'>
                                        {username?.slice(0, 1) ?? ''}
                                    </AvatarFallback>
                                </Avatar>
                                <span className='flex-[3]'>{username}</span>
                                <Button onClick={() => handleOperate(userId, true)}>同意</Button>
                                <Button onClick={() => handleOperate(userId, false)}>拒绝</Button>
                            </Card>
                        ))
                    ) : (
                        <div className='flex flex-col gap-2 items-center'>
                            <NoResult className='w-[60%] h-auto' />
                            <span className='text-xs text-gray-500 select-none'>暂无好友申请</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
