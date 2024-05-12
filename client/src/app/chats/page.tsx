import LeftPanel from '@/app/chats/LeftPanel';
import Chat from '@/app/chats/Chat';

export default function ChatsPage() {
    return (
        <div className='flex w-full'>
            <LeftPanel />
            <Chat />
        </div>
    );
}
