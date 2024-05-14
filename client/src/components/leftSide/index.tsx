import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface LeftSideProps {
    title?: React.ReactNode;
    topChildren?: React.ReactNode;
    children: React.ReactNode;
}

export default function LeftSide(props: LeftSideProps) {
    const { title, topChildren, children } = props;

    return (
        <Card className='flex flex-col h-full max-h-full bg-leftPanel w-96 border-l-0 border-t-0 border-b-0 rounded-l-none rounded-r-[15px]'>
            <div className='flex flex-col gap-3 py-6 px-4'>
                <Input type='search' placeholder='搜索' />
                <div className='border-t border-gray-200' />
                {topChildren}
            </div>
            <CardHeader>{title}</CardHeader>
            <CardContent className='flex-auto overflow-y-auto mt-2'>{children}</CardContent>
        </Card>
    );
}
