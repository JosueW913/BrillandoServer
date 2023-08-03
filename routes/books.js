var express = require('express');
var router = express.Router();

//models required
const Book = require('../models/Book')
const Comment = require('../models/Comment');

//middleware required
const isAuthenticated = require('../middleware/isAuthenticated');
const isBookOwner = require('../middleware/isBookOwner')

//Routes
router.get('/', (req, res, next) => {
  
    Book.find()
        .then((allBooks) => {
            res.json(allBooks)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

router.post('/new-book', isAuthenticated, (req, res, next) => {

    const { owner, image, ageLevel, subject, description } = req.body

    Book.create(
        { 
            owner, 
            image, 
            ageLevel, 
            subject, 
            description
        }
        )
        .then((newBook) => {
            res.json(newBook)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.get('/book-detail/:bookId', (req, res, next) => {

    const { bookId } = req.params

    Book.findById(bookId)
        .populate({
            path: 'comments',
            populate: { path: 'author'}
        })
        .then((foundBook) => {
            res.json(foundBook)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/book-update/:bookId', isAuthenticated, isBookOwner, (req, res, next) => {

    const { bookId } = req.params

    const { image, ageLevel, subject, description } = req.body

    Book.findByIdAndUpdate(
        bookId,
        { 
            image, 
            ageLevel, 
            subject, 
            description 
        },
        { new: true}
    )
        .then((updatedBook) => {
            res.json(updatedBook)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/delete-book/:bookId', isAuthenticated, isBookOwner, (req, res, next) => {

    const { bookId } = req.params

    Book.findByIdAndDelete(bookId)
        .then((deletedBook) => {
            res.json(deletedBook)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/add-comment/:bookId', isAuthenticated, (req, res, next) => {

    Comment.create({
        author: req.user._id,
        comment: req.body.comment
    })
        .then((createdComment) => {

            Book.findByIdAndUpdate(
                req.params.bookId,
                {
                    $push: {comments: createdComment._id}
                }
            )
            .populate({
                path: 'comments',
                populate: { path: 'author'}
            })
            .then((updatedBook) => {
                res.json(updatedBook)
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })

        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

module.exports = router;