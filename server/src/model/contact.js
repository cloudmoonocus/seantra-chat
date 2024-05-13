const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    contacts: { type: Array },
    applyList: { type: Array },
});

contactSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    },
});

module.exports = mongoose.model('contact', contactSchema, 'contact');
