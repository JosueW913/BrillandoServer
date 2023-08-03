const Book = require('../models/Book')

const isBookOwner = (req, res, next) => {

    Book.findById(req.params.id)
        .then((foundBook) => {
            
            if(req.body.owner === foundBook.owner.toString()) {
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