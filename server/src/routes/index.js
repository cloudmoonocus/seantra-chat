const messageRouter = require('./message');
const connectSocket = require('./socket');
const userRouter = require('./user');

module.exports = {
    messageRouter,
    connectSocket,
    userRouter,
};
