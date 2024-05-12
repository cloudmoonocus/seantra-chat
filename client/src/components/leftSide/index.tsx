'use client';
import Image from 'next/image';
import Avatar from './assets/avatar.svg';
import Chats from './assets/chats.svg';
import Group from './assets/group.svg';
import Contacts from './assets/contacts.svg';
import Setting from './assets/setting.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from '@/components/ui/avatar';
import { getAvatar } from '@/lib/utils';
import { useUserInfo } from '@/region/user';
import UserProfileCard from '@/components/UserProfileCard';

const iconConfigs = [
    {
        key: 'avatar',
        title: '个人主页',
        iconName: <Avatar theme='outline' size='17' />,
        route: '/profile',
    },
    {
        key: 'chats',
        title: '聊天',
        iconName: <Chats theme='outline' size='17' />,
        route: '/chats',
    },
    {
        key: 'group',
        title: '群组',
        iconName: <Group theme='outline' size='17' />,
        route: '/group',
    },
    {
        key: 'contacts',
        title: '联系人',
        iconName: <Contacts theme='outline' size='17' />,
        route: '/contacts',
    },
];

export default function LeftSide() {
    const pathname = usePathname();
    const { userId, username, email, createdTime } = useUserInfo() ?? {};

    return (
        <div className='w-full lg:w-[75px] shadow lg:flex lg:flex-col flex flex-row justify-between items-center fixed lg:relative z-40 bottom-0 bg-white dark:bg-zinc-600'>
            <div className='lg:my-5 lg:block'>
                <Image src='/icon.png' width={40} height={40} alt='icon' className='w-full h-full rounded-full' />
            </div>
            <div className='w-full h-full'>
                <ul className='flex flex-row justify-center w-full h-full lg:flex-col lg:flex nav-tabs'>
                    {iconConfigs.map((config) => (
                        <Link
                            key={config.key}
                            href={config.route}
                            title={config.title}
                            className={`link ${pathname === config.route ? 'bg-slate-200' : ''}`}
                        >
                            <li className='flex justify-center items-center h-16 hover:bg-slate-100 cursor-pointer'>
                                {config.iconName}
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
            <div className='w-20 my-5 lg:w-auto'>
                <ul className='flex flex-col gap-5'>
                    <li className='flex justify-center'>
                        <UserProfileCard userId={userId} username={username} email={email} createdTime={createdTime}>
                            <AvatarUI className='w-[40px] h-[40px]'>
                                <AvatarImage src={getAvatar(userId)} />
                                <AvatarFallback className='bg-blue-100'>{username?.slice(0, 1) ?? ''}</AvatarFallback>
                            </AvatarUI>
                        </UserProfileCard>
                    </li>
                    <li className='flex justify-center'>
                        <Setting theme='outline' size='17' />
                    </li>
                </ul>
            </div>
        </div>
    );
}
