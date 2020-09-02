const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog')

// Get all blog
router.get('/', (req, res) => {
    Blog.find({}).then((blogs) =>{
        res.send(blogs);
    })
});

// Add new blog
router.post('/posts', (req, res, next) => {
    Blog.create(req.body).then((blog) => {
        res.send(blog);
    }).catch(next);
});

// Update a current blog
router.put('/post/:id', (req, res, next) => {
    Blog.findByIdAndUpdate({_id: req.params.id}).then((blog) => {
        Blog.findOne({_id: req.params.id}).then(() => {
            res.send(blog)
        })
    })
});

// Delete a blog
router.delete('/posts/:id', (req, res, next) => {
    Blog.findByIdAndRemove({_id: req.params.id}).then((blog) => {
        res.send(Blog)
    })
});

module.exports = router;
