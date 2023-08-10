const { Schema, model } = require('mongoose')

const activitySchema = new Schema (
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        title: String,
        image: String,
        ageLevel: String,
        subject: String,
        materials: String,
        procedures: String,
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    },
    {
        timeseries: true
    }
    )

    module.exports = model('Activity', activitySchema)