const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxLength: [50, 'Title must be at most 50 characters long'],
    },
    keywords: {
        type: [String],
        default: [],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
    },
    post_likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    post_comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        default: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);