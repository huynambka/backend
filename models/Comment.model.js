const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
   content: {
       type: String,
   },
    author_id:{
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post_id:{
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
},{
    timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);