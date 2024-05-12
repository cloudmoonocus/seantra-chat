const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [
        {
            senderId: {
                type: String,
                required: true,
            },
            receiverId: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Number,
                required: true,
            },
        },
    ],
});

messageSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        ret.messages.forEach((message) => {
            delete message._id;
        });
    },
});

module.exports = mongoose.model('message', messageSchema, 'message');
