const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    createdTime: { type: Number, required: true },
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    },
});

module.exports = mongoose.model('user', userSchema, 'user');
