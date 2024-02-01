const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
    {
        question: { type: String, required: [true, 'question is required'] },
        answer: { type: String, required: [true, 'answer is required'] },
        priority: { type: Number, default: 1, },
        status: { type: Boolean, default: true, },
    },
    { timestamps: true },
)

const FAQ = mongoose.model('faq', faqSchema);
module.exports = FAQ;