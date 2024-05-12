import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 从 localStorage 获取 token
 */
export function getToken() {
    return window.localStorage.getItem('token');
}

/**
 * 获取头像
 */
export function getAvatar(userId?: string) {
    if (!userId) {
        return '';
    }
    return `https://api.multiavatar.com/${userId}.png`;
}

/**
 * 清除登录状态，跳转至认证页面
 */
export function clearLoginStatus() {
    window.localStorage.removeItem('token');
    window.location.href = '/auth';
}
