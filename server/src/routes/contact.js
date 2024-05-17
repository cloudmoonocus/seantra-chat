const { authenticateToken } = require('../middleWare');
const asyncHandler = require('express-async-handler');
const express = require('express');
const { getUser } = require('../util');
const { ContactModel } = require('../model');
const router = express.Router();

// 检测目标联系人用户是否存在
const validateContact = async (req, res, next) => {
    const { contactId } = req.body;
    const contactUser = await getUser(contactId);
    if (!contactUser) {
        return res.send({ code: 404, message: '用户不存在' });
    }
    next();
};

// 申请添加联系人
router.post(
    '/add',
    authenticateToken,
    validateContact,
    asyncHandler(async (req, res) => {
        const { contactId } = req.body;
        const { userId: currentUserId } = req.userData;
        // 检查联系人是否已经存在
        const existingContact = await ContactModel.findOne({ userId: currentUserId, contacts: contactId });
        if (existingContact) {
            return res.send({ code: 400, message: '该用户已经是你的好友了' });
        }
        // 检测当前用户是否在目标用户的申请列表中
        const existingApply = await ContactModel.findOne({ userId: contactId, applyList: currentUserId });
        if (existingApply) {
            return res.send({ code: 400, message: '该用户已经在你的申请列表中' });
        }
        // 添加联系人到用户的申请列表
        await ContactModel.updateOne({ userId: contactId }, { $push: { applyList: currentUserId } }, { upsert: true });
        res.send({ code: 200, message: '申请成功' });
    }),
);

// 同意联系人申请
router.post(
    '/agree',
    authenticateToken,
    validateContact,
    asyncHandler(async (req, res) => {
        const { contactId } = req.body;
        const { userId: currentUserId } = req.userData;
        // 检测目标用户是否已经是当前用户的联系人
        const existingContact = await ContactModel.findOne({ userId: currentUserId, contacts: contactId });
        if (existingContact) {
            // 删除申请记录
            await ContactModel.updateOne({ userId: currentUserId }, { $pull: { applyList: contactId } });
            await ContactModel.updateOne({ userId: contactId }, { $pull: { applyList: currentUserId } });
            return res.send({ code: 400, message: '该用户已经是你的好友了' });
        }
        // 检测目标用户是否在当前用户的申请列表中
        const existingApply = await ContactModel.findOne({ userId: currentUserId, applyList: contactId });
        if (!existingApply) {
            return res.send({ code: 400, message: '该用户不在你的申请列表中' });
        }
        // 删除申请记录
        await ContactModel.updateOne({ userId: currentUserId }, { $pull: { applyList: contactId } });
        await ContactModel.updateOne({ userId: contactId }, { $pull: { applyList: currentUserId } });
        // 添加联系人到当前用户的联系人列表
        await ContactModel.updateOne({ userId: currentUserId }, { $push: { contacts: contactId } }, { upsert: true });
        // 添加联系人到目标用户的联系人列表
        await ContactModel.updateOne({ userId: contactId }, { $push: { contacts: currentUserId } }, { upsert: true });
        res.send({ code: 200, message: '添加成功' });
    }),
);

// 拒绝联系人申请
router.post(
    '/reject',
    authenticateToken,
    validateContact,
    asyncHandler(async (req, res) => {
        const { contactId } = req.body;
        const { userId: currentUserId } = req.userData;
        // 检测当前用户是否在目标用户的申请列表中
        const existingApply = await ContactModel.findOne({ userId: currentUserId, applyList: contactId });
        if (!existingApply) {
            return res.send({ code: 400, message: '该用户不在你的申请列表中' });
        }
        // 删除申请记录
        await ContactModel.updateOne({ userId: currentUserId }, { $pull: { applyList: contactId } });
        res.send({ code: 200, message: '拒绝成功' });
    }),
);

// 删除联系人
router.post(
    '/delete',
    authenticateToken,
    validateContact,
    asyncHandler(async (req, res) => {
        const { contactId } = req.body;
        const { userId: currentUserId } = req.userData;
        // 检查联系人是否是该用户的联系人
        const existingContact = await ContactModel.findOne({ userId: currentUserId, contacts: contactId });
        if (!existingContact) {
            return res.send({ code: 400, message: '该用户不是你的联系人' });
        }
        // 从用户的联系人列表中删除联系人
        await ContactModel.updateOne({ userId: currentUserId }, { $pull: { contacts: contactId } });
        // 从联系人的联系人列表中删除用户
        await ContactModel.updateOne({ userId: contactId }, { $pull: { contacts: currentUserId } });
        res.send({ code: 200, message: '删除成功' });
    }),
);

// 获取用户的联系人列表
router.get(
    '/list',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { userId: currentUserId } = req.userData;
        const contactList = await ContactModel.findOne({ userId: currentUserId });
        if (!contactList) {
            await ContactModel.create({ userId: currentUserId, contacts: [], applyList: [] });
            return res.send({ code: 200, data: [], message: '获取成功' });
        }
        const { contacts } = contactList;
        res.send({ code: 200, message: '获取成功', data: contacts });
    }),
);

// 查看当前联系人申请列表
router.get(
    '/applyList',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { userId: currentUserId } = req.userData;
        const contactList = await ContactModel.findOne({ userId: currentUserId });
        if (!contactList) {
            await ContactModel.create({ userId: currentUserId, contacts: [], applyList: [] });
            return res.send({ code: 200, data: [], message: '获取成功' });
        }
        const { applyList } = contactList;
        res.send({ code: 200, message: '获取成功', data: applyList });
    }),
);

module.exports = router;
