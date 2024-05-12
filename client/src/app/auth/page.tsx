import Image from 'next/image';
import Link from 'next/link';
import AuthForm from './form';
import authBackgroundImg from './assets/authBackgroundImg.png';
import iconImg from '../icon.png';

function AuthPage() {
    return (
        <div className='container relative h-full flex-col items-center justify-center bg-gray-50 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
            <div className='relative hidden h-full flex-col bg-muted p-10 text-white bg-[#6235ba] lg:flex'>
                <Image alt='authBackgroundImg' src={authBackgroundImg} className='absolute inset-0 w-full h-full' />
                <div className='relative z-20 flex items-center text-lg font-medium'>
                    <Link href='/' className='flex items-center gap-2'>
                        <Image src={iconImg} alt='Seantra Chat' className='rounded-full' width={40} height={40} />
                        <span>Seantra Chat</span>
                    </Link>
                </div>
                <div className='relative z-20 mt-auto'>
                    <blockquote className='space-y-2'>
                        <p className='text-lg'>“The best way to predict the future is to invent it.”</p>
                        <footer className='text-sm'>--- Alan Kay</footer>
                    </blockquote>
                </div>
            </div>
            <div className='lg:p-8'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
                    <div className='flex flex-col space-y-2 text-center'>
                        <h1 className='text-2xl font-semibold tracking-tight'>🎉 进入 Seantra Chat</h1>
                    </div>
                    <AuthForm />
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
