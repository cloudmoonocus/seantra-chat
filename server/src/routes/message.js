const express = require('express');
const { MessagesModel, UserModel } = require('../model/index.js');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authenticateToken } = require('../middleWare');

// 获取某个对话的所有消息
router.get(
    '/getMessage/:conversationId',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const data = await MessagesModel.findOne({
            conversationId: req.params.conversationId,
        });
        if (!data) {
            res.send({ code: 404, message: '对话不存在' });
            return;
        }
        res.send({ code: 200, data, message: '获取成功' });
    }),
);

const getTargetUserInfo = async (userId) => {
    const user = await UserModel.findOne({ userId });
    if (!user) {
        return {};
    }
    return {
        userId: user.userId,
        username: user.username,
        email: user.email,
        createdTime: user.createdTime,
    };
};

// 获取某个用户的全部消息，该用户可能是发送者或接收者
router.get(
    '/getMessagesByUser',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const userId = req.userData.userId;
        const messages = await MessagesModel.find({
            $or: [{ 'messages.senderId': userId }, { 'messages.receiverId': userId }],
        });
        if (!messages) {
            res.send({ code: 404, message: '对话不存在' });
            return;
        }
        const formatMessages = messages.reduce((acc, cur) => {
            const getUserInfoPromise = getTargetUserInfo(cur.conversationId.split('@@').find((id) => id !== userId));
            acc.push(getUserInfoPromise);
            return acc;
        }, []);
        const targetUserInfos = await Promise.all(formatMessages);
        const formattedMessages = messages.reduce((prev, cur, index) => {
            prev[cur.conversationId] = {
                conversationId: cur.conversationId,
                messages: cur.messages,
                targetUserInfo: targetUserInfos[index],
            };
            return prev;
        }, {});
        res.send({
            code: 200,
            data: formattedMessages,
            message: '获取成功',
        });
    }),
);

// [TODO] [Test] 发送消息（这个接口仅供测试使用）
router.post(
    '/postMessage',
    asyncHandler(async ({ body: { senderId, receiverId, text } }, res) => {
        const conversationId = [senderId, receiverId].sort().join('@@');
        // 是否存在，不存在新增一个 document
        const data = await MessagesModel.findOne({ conversationId });
        if (!data) {
            const newData = new MessagesModel({
                conversationId,
                messages: [
                    {
                        senderId,
                        receiverId,
                        text,
                        timestamp: Date.now(),
                    },
                ],
            });
            await newData.save();
            res.send({ code: 200, message: '发送成功' });
            return;
        }
        // 存在，更新 message document
        const dataToUpdate = {
            senderId,
            receiverId,
            text,
            timestamp: Date.now(),
        };
        const updatedData = await MessagesModel.findOneAndUpdate(
            { conversationId },
            { $push: { messages: dataToUpdate } },
            { new: true },
        );
        if (updatedData) {
            res.send({ code: 200, message: '发送成功' });
        } else {
            res.send({ code: 404, message: '对话不存在' });
        }
    }),
);

module.exports = router;
