import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatar } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserInfo, useUserInfo } from '@/region/user';
import moment from 'moment';
import { PopoverArrow, PopoverClose } from '@radix-ui/react-popover';
import { useRequest } from 'ahooks';
import { apiGetUserInfo } from '@/api/user';
import { Cross2Icon } from '@radix-ui/react-icons';

interface UserProfileCardProps {
    children: React.ReactNode;
    userId?: string;
}

function UserProfileCard({ children, userId: targetUserId }: UserProfileCardProps) {
    const { userId: currentUserId } = useUserInfo() ?? {};
    const [userData, setUserData] = useState<UserInfo>();
    const { username = '-', createdTime, email = '-' } = userData ?? {};
    const { run } = useRequest(apiGetUserInfo, {
        manual: true,
        onSuccess: (data) => {
            if (data.code === 200) {
                setUserData(data.data);
            }
        },
        cacheKey: targetUserId,
    });
    const isCurrentUser = targetUserId === currentUserId;
    const isFriend = false;

    const handleEdit = () => {
        // 处理编辑资料逻辑
    };

    const handleChat = () => {
        // 处理聊天逻辑
    };

    const handleAddFriend = () => {
        // 处理添加好友逻辑
    };

    const EditArea = () => {
        if (isCurrentUser) {
            return (
                <Button onClick={handleEdit} size='sm'>
                    编辑资料
                </Button>
            );
        }
        if (isFriend) {
            return (
                <Button onClick={handleChat} size='sm'>
                    聊天
                </Button>
            );
        }
        return (
            <Button onClick={handleAddFriend} size='sm'>
                申请好友
            </Button>
        );
    };

    return (
        <Popover onOpenChange={(open) => open && run(targetUserId)}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className='flex flex-col gap-3 items-center relative w-80' side='right' align='end'>
                <Avatar className='w-20 h-20'>
                    <AvatarImage src={getAvatar(targetUserId)} />
                    <AvatarFallback className='bg-blue-100'>{username.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <EditArea />
                <div className='flex w-full'>
                    <div className='w-20'>昵称：</div>
                    <span className='text-muted-foreground max-w-56 truncate' title={username}>
                        {username}
                    </span>
                </div>
                <div className='flex w-full'>
                    <div className='w-20'>邮箱：</div>
                    <span className='text-muted-foreground max-w-56 truncate' title={email}>
                        {email}
                    </span>
                </div>
                <div className='flex w-full'>
                    <div className='w-20'>注册日期：</div>
                    <span
                        className='text-muted-foreground max-w-56 truncate'
                        title={moment(createdTime).format('YYYY年MM月DD日')}
                    >
                        {createdTime ? moment(createdTime).format('YYYY年MM月DD日') : '-'}
                    </span>
                </div>
                <PopoverArrow />
                <PopoverClose className='absolute top-[15px] right-[15px]'>
                    <Cross2Icon />
                </PopoverClose>
            </PopoverContent>
        </Popover>
    );
}

export default UserProfileCard;
