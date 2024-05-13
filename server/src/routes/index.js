const messageRouter = require('./message');
const connectSocket = require('./socket');
const userRouter = require('./user');
const contactRouter = require('./contact');

module.exports = {
    messageRouter,
    connectSocket,
    userRouter,
    contactRouter,
};
