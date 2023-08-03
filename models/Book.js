const { Schema, model } = require('mongoose')

const bookSchema = new Schema (
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        image: String,
        ageLevel: String,
        subject: String,
        description: String,
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    },
    {
        timeseries: true
    }
    )

    module.exports = model('Book', bookSchema)