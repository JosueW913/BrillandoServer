const Book = require('../models/Book')

const isBookOwner = (req, res, next) => {

    Book.findById(req.params.bookId)
        .then((foundBook) => {
            
            if(req.user._id === foundBook.owner.toString()) {
                next()
            } else {
                res.status(401).json({message: 'Validation Error'})
            }
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

}

module.exports = isBookOwner;