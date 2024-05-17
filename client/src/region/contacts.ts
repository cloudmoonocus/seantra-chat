import { createRegion } from 'region-core';
import { apiGetContactsList } from '@/api/contacts';
import { apiGetUserInfo } from '@/api/user';
import { UserInfo } from '@/region/user';

const contactsListMapRegion = createRegion<UserInfo[]>();
export const useContactsListMap = contactsListMapRegion.useValue;
export const setContactsListMap = contactsListMapRegion.set;
export const useContactsListMapLoading = contactsListMapRegion.useLoading;
export const loadContactsListMap = contactsListMapRegion.loadBy(async () => {
    const res = await apiGetContactsList();
    if (res.code === 200) {
        const contactsList = res.data;
        const requestList = await Promise.all(contactsList.map(apiGetUserInfo));
        return requestList.map((item) => item.data);
    }
    return [];
});
