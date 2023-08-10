const Activity = require('../models/Activity')

const isActivityOwner = (req, res, next) => {

    Activity.findById(req.params.activityId)
        .then((foundActivity) => {
            console.log("Found Activity ==>", foundActivity)
            
            if(req.user._id === foundActivity.owner.toString()) {
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

module.exports = isActivityOwner;