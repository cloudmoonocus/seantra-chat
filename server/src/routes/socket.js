const { Server } = require('socket.io');
const { MessagesModel } = require('../model/index.js');

function connectSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            credentials: true,
        },
    });

    // 用户 ID 到 socket ID 的映射，以便根据用户 ID 发送消息
    const userSockets = {};

    io.on('connection', (socket) => {
        console.log('🔗 A user connected');

        // 用户加入时发送他们的 ID 和 socket ID 到服务端
        socket.on('join', ({ userId }) => {
            userSockets[userId] = socket.id;
            console.log(`📢 User ${userId} connected with socket ID ${socket.id}`);
        });

        // 监听来自客户端的消息
        socket.on('postMessage', async (messageConfig) => {
            await updateDataBase(messageConfig);
            const { receiverId } = messageConfig ?? {};
            // 发送消息给特定的用户
            if (userSockets[receiverId]) {
                io.to(userSockets[receiverId]).emit('message', messageConfig);
            } else {
                console.error('❌ User not found');
            }
        });

        // 断开连接时清理
        socket.on('disconnect', () => {
            Object.keys(userSockets).forEach((userId) => {
                if (userSockets[userId] === socket.id) {
                    delete userSockets[userId];
                }
            });
        });
    });
}

async function updateDataBase(messageConfig) {
    const { senderId, receiverId, text, conversationId, timestamp } = messageConfig ?? {};
    // 不存在，新增 document
    const data = await MessagesModel.findOne({ conversationId });
    if (!data) {
        const newData = new MessagesModel({
            conversationId,
            messages: [
                {
                    senderId,
                    receiverId,
                    text,
                    timestamp,
                },
            ],
        });
        await newData.save();
        return;
    }
    // 存在，更新 document
    const dataToUpdate = {
        senderId,
        receiverId,
        text,
        timestamp,
    };
    await MessagesModel.findOneAndUpdate({ conversationId }, { $push: { messages: dataToUpdate } }, { new: true });
}

module.exports = connectSocket;
