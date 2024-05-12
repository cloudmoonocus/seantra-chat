import request, { Result } from './http';
import { UserInfo } from '@/region/user';

interface AuthResult {
    userId: string;
    token: string;
    message: string;
}

// 登录 + 注册
export function apiAuthIdentity({ email, password }: { email: string; password: string }): Result<AuthResult> {
    return request.post(
        '/user/auth',
        { email, password },
        {
            noAuth: true,
        },
    );
}

/**
 * 获取用户信息
 * @param userId 携带该参数，获取指定用户信息，否则获取当前用户信息
 */
export function apiGetUserInfo(userId?: string): Result<UserInfo> {
    const url = userId ? `/user/info?userId=${userId}` : '/user/info';
    return request.get(url);
}
