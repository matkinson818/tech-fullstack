const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Blog = require('../models/Blog');


// Get all blogs
exports.getBlogs = asyncHandler(async (req, res, next) => {
    let query;

    const reqQuery = {...req.query};

    const removeFields = ['select', 'sort'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryString = JSON.stringify(req.query);

    queryString = replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = blog.find(JSON.parse(queryString));

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort){
        const sortBy = req.query.sort.splt(',').join(' ');
        query.query.sort(sortBy)
    }else{
       query =- query.sort('-createdAt') 
    }
    const blogs = await query;

    res.status(200).json({
        msg: 'success',
        data: blogs
    })
});

// Get a single blog
exports.getBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if(!blog) {
        return next(new ErrorResponse('Blog Not Found', 400))
    }

    res.status(200).json({
        msg: 'success',
        data: blogs
    })
}); 

// Delete a blog
exports.deleteBlog = asyncHandler(async (req, res, next) => {
    const blogs = Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
        msg: 'success',
        data: {}
    })
});

// Create a blog
exports.createBlog = asyncHandler(async (req, res, next) => {
    const blogs = await Blog.create(req.body);


    res.status(200).json({
        msg: 'success',
        data: blogs
    });
});

// Update blog
exports.updateBlog = asyncHandler(async (req, res, next) => {
    const blogs = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        msg: 'success',
        data: blogs
    })
});