const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Title is required'],
        trim: true
    },
    post: {
        type: String,
        required: [true, 'Post is required']
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);