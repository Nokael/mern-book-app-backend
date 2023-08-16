const express = require('express');
const asyncHandler = require('express-async-handler');
const Book = require("../models/Book");
const authMiddleware = require('../middleWares/authMiddleware');


const bookRouter = express.Router();

// create book
bookRouter.post('/', authMiddleware, asyncHandler( async(req, res) => {

    // grab user from req.user
    const userId = req.user._id;
    const book = new Book({
        title: req.body.title,
        category: req.body.category,
        createdBy: userId,
        author: req.body.author,
        coverImageUrl: req.body.coverImageUrl,
        amazonLink: req.body.amazonLink
    });
    await book.save();

    if(book){
        res.status(200);
        res.json(book);
    } else {
        res.status(500);
        throw new Error('Book could not be created');
    }
}));

// get all books or  search for books by title or author
bookRouter.get('/', asyncHandler( async(req, res) => {

    Book.find().then((books) => res.json(books));
}));

// bookRouter.get('/api/books/search', (req, res) => {
//   const searchTerm = req.query.q;
//   const searchRegex = new RegExp(searchTerm, 'i');
//   Book.find({ $or: [{ title: searchRegex }, { author: searchRegex }] }).then((books) => res.json(books));
// });

// bookRouter.get('/api/books/category/:category', (req, res) => {
//   const category = req.params.category;
//   Book.find({ category }).then((books) => res.json(books));
// });


// update book
bookRouter.put('/:id', authMiddleware, asyncHandler( async(req, res) => {

    const book = await Book.findById(req.params.id);

    if(book){
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true});

        res.status(200);
        res.json(updatedBook);
    } else {
        res.status(500);
        throw new Error('Book could bot be updated');
    }
}));

// delete book
bookRouter.delete('/:id', authMiddleware, asyncHandler( async(req, res) => {

        try {
            const deletedBook = await Book.findByIdAndDelete(req.params.id);
            res.status(200);
            res.send(deletedBook);

        } catch (error) {
            res.json(500);
        }

 
}));

    // "build": "cd backend && npm install && cd ../frontend && npm install && npm run build"


module.exports = bookRouter; 
