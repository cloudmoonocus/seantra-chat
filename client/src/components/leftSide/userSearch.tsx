'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatar } from '@/lib/utils';
import { apiSearchUser } from '@/api/user';
import { UserInfo } from '@/region/user';
import { useRequest } from 'ahooks';
import { Skeleton } from '@/components/ui/skeleton';
import { apiApplyContact } from '@/api/contacts';
import { useToast } from '@/components/ui/use-toast';

export default function UserSearch() {
    const { toast } = useToast();
    const [searchText, setSearchText] = useState<string>('');
    const [userList, setUserList] = useState<UserInfo[]>([]);
    const { run: handleSearch, loading } = useRequest(apiSearchUser, {
        manual: true,
        onSuccess({ code, data, message }) {
            if (code === 200) {
                setUserList(data);
                return;
            }
            toast({ title: message });
        },
    });

    const handleApply = async (contactId: string) => {
        const res = await apiApplyContact(contactId);
        if (res.code === 200) {
            toast({ title: '申请成功' });
            return;
        }
        toast({ title: res.message });
    };

    return (
        <>
            <Dialog>
                <div className='flex w-full items-center space-x-2'>
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        type='search'
                        placeholder='搜索'
                    />
                    {searchText.trim() && (
                        <DialogTrigger asChild>
                            <Button variant='outline' onClick={() => handleSearch(searchText)}>
                                🔍
                            </Button>
                        </DialogTrigger>
                    )}
                </div>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{searchText}</DialogTitle>
                        <DialogDescription>共 {userList.length} 个用户匹配</DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-3'>
                        {loading ? (
                            <>
                                <div className='flex items-center gap-3 box-content h-[40px] px-4 py-2'>
                                    <Skeleton className='h-[40px] w-[40px] rounded-full bg-gray-300' />
                                    <Skeleton className='h-[25px] flex-[3] bg-gray-300' />
                                    <Skeleton className='h-[25px] flex-1 bg-gray-300' />
                                </div>
                                <div className='flex items-center gap-3 box-content h-[40px] px-4 py-2'>
                                    <Skeleton className='h-[40px] w-[40px] rounded-full bg-gray-300' />
                                    <Skeleton className='h-[25px] flex-[3] bg-gray-300' />
                                    <Skeleton className='h-[25px] flex-1 bg-gray-300' />
                                </div>
                            </>
                        ) : (
                            userList.map(({ userId, username }) => (
                                <Card key={userId} className='flex items-center gap-3 box-content h-[40px] px-4 py-2'>
                                    <Avatar className='w-[40px] h-[40px]'>
                                        <AvatarImage src={getAvatar(userId)} />
                                        <AvatarFallback className='bg-blue-100'>
                                            {username?.slice(0, 1) ?? ''}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='flex-[3]'>{username}</span>
                                    <Button variant='secondary' onClick={() => handleApply(userId)}>
                                        申请
                                    </Button>
                                </Card>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
