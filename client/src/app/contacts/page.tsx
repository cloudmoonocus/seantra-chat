import LeftSide from '@/components/leftSide';
import { CardTitle } from '@/components/ui/card';
import ContactsList from '@/app/contacts/ContactsList';
import GoChat from '@/app/contacts/assets/goChat.svg';
import ApplyList from '@/app/contacts/applyList';

export default function ContactsPage() {
    return (
        <div className='flex w-full'>
            <LeftSide title={<CardTitle>好友</CardTitle>} topChildren={<ApplyList />}>
                <ContactsList />
            </LeftSide>
            <div className='flex-auto flex flex-col h-full'>
                <div className='w-2/5 m-auto text-center'>
                    <GoChat />
                    <div className='font-bold'>选择联系人开始聊天吧 💬</div>
                </div>
            </div>
        </div>
    );
}
