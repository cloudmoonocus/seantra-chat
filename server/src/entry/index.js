const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { messageRouter, connectSocket, userRouter, contactRouter } = require('../routes');
const connectMongoDB = require('./mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: '*',
    }),
);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);
app.use('/api/contact', contactRouter);
app.use((err, req, res) => {
    res.status(err.status ?? 500).json({ message: err.message });
});

// 连接 MongoDB
connectMongoDB().catch(console.error);

const server = http.createServer(app);

// 连接 Socket.io
connectSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`👂 Server listening on port ${PORT}`);
});

server.on('close', async () => {
    await mongoose.connection.close();
});
