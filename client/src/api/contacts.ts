import request, { Result } from './http';

// 申请联系人好友
export function apiApplyContact(contactId: string): Result<undefined> {
    return request.post(`/contact/add`, { contactId });
}

// 同意联系人好友
export function apiAgreeContact(contactId: string): Result<undefined> {
    return request.post(`/contact/agree`, { contactId });
}

// 拒绝联系人好友
export function apiRejectContact(contactId: string): Result<undefined> {
    return request.post(`/contact/reject`, { contactId });
}

// 删除联系人
export function apiDeleteContact(contactId: string): Result<undefined> {
    return request.post(`/contact/delete`, { contactId });
}

// 获取联系人列表
export function apiGetContactsList(userId?: string): Result<string[]> {
    const url = userId ? `/contact/list?userId=${userId}` : '/contact/list';
    return request.get(url);
}

// 获取申请人列表
export function apiGetApplyList(userId?: string): Result<string[]> {
    const url = userId ? `/contact/applyList?userId=${userId}` : '/contact/applyList';
    return request.get(url);
}
