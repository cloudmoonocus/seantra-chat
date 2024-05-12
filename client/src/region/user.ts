import { createRegion } from 'region-core';
import { apiGetUserInfo } from '@/api/user';

export interface UserInfo {
    userId: string;
    email: string;
    username: string;
    createdTime: number;
}

const userInfoRegion = createRegion<UserInfo>();
export const useUserInfo = userInfoRegion.useValue;
export const getUserInfo = userInfoRegion.getValue;
export const loadUserInfo = userInfoRegion.loadBy(async () => {
    const res = await apiGetUserInfo();
    if (res.code === 200) {
        return res.data;
    }
    return {} as UserInfo;
});
