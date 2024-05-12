'use client';
import { SyntheticEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRequest } from 'ahooks';
import { apiAuthIdentity } from '@/api/user';
import IconLoading from '/public/icon/loading.svg';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

function AuthForm() {
    const router = useRouter();
    const { toast } = useToast();
    const { loading, run } = useRequest(apiAuthIdentity, {
        manual: true,
        onSuccess: ({ code, data, message }) => {
            if (code === 200) {
                if (!data) {
                    return;
                }
                router.replace('/chats');
                const { token } = data;
                localStorage.setItem('token', token);
                toast({
                    description: '🎉 欢迎使用 Seantra Chat!',
                });
            } else {
                toast({
                    description: message,
                });
            }
        },
        onError: (error) => {
            console.error(error);
            toast({
                description: error.message,
            });
        },
    });

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;
        if (!email || !password) {
            return;
        }
        run({ email, password });
    };

    return (
        <div className='grid gap-6'>
            <form onSubmit={onSubmit}>
                <div className='grid gap-5'>
                    <div className='grid gap-1'>
                        <Label className='sr-only' htmlFor='email'>
                            邮箱
                        </Label>
                        <Input
                            id='email'
                            placeholder='请输入您的邮箱'
                            type='email'
                            autoCapitalize='none'
                            autoComplete='email'
                            autoCorrect='off'
                            disabled={loading}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <Label className='sr-only' htmlFor='password'>
                            密码
                        </Label>
                        <Input
                            id='password'
                            placeholder='请输入您的密码'
                            type='password'
                            autoCapitalize='none'
                            autoComplete='current-password webauthn'
                            autoCorrect='off'
                            disabled={loading}
                        />
                    </div>
                    <Button disabled={loading}>
                        {loading && <IconLoading className='mr-2 h-4 w-4 animate-spin text-white' />}
                        登录
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AuthForm;
