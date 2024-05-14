import LeftPanel from '@/app/chats/LeftPanel';
import Chat from '@/app/chats/Chat';
import LeftSide from '@/components/leftSide';
import { CardTitle } from '@/components/ui/card';

export default function ChatsPage() {
    return (
        <div className='flex w-full'>
            <LeftSide title={<CardTitle>聊天</CardTitle>}>
                <LeftPanel />
            </LeftSide>
            <Chat />
        </div>
    );
}
