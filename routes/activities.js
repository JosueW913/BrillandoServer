var express = require('express');
var router = express.Router();

//models required
const Activity = require('../models/Activity')
const Comment = require('../models/Comment');

//middleware required
const isAuthenticated = require('../middleware/isAuthenticated');
const isActivityOwner = require('../middleware/isActivityOwner')

//Routes
router.get('/', (req, res, next) => {
  
    Activity.find()
        .then((allActivities) => {
            res.json(allActivities)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

router.post('/new-activity', isAuthenticated, (req, res, next) => {

    const { owner, image, ageLevel, subject, materials, procedures } = req.body

    Activity.create(
        { 
            owner, 
            image, 
            ageLevel, 
            subject, 
            materials, 
            procedures 
        }
        )
        .then((newActivity) => {
            res.json(newActivity)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.get('/activity-detail/:activityId', (req, res, next) => {

    const { activityId } = req.params

    Activity.findById(activityId)
        .populate({
            path: 'comments',
            populate: { path: 'author'}
        })
        .then((foundActivity) => {
            res.json(foundActivity)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/activity-update/:activityId', isAuthenticated, isActivityOwner, (req, res, next) => {

    const { activityId } = req.params

    const { image, ageLevel, subject, materials, procedures } = req.body

    Activity.findByIdAndUpdate(
        activityId,
        { 
            image, 
            ageLevel, 
            subject, 
            materials, 
            procedures 
        },
        { new: true}
    )
        .then((updatedActivity) => {
            res.json(updatedActivity)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/delete-activity/:activityId', isAuthenticated, isActivityOwner, (req, res, next) => {

    const { activityId } = req.params

    Activity.findByIdAndDelete(activityId)
        .then((deletedActivity) => {
            res.json(deletedActivity)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/add-comment/:activityId', isAuthenticated, (req, res, next) => {

    Comment.create({
        author: req.user._id,
        comment: req.body.comment
    })
        .then((createdComment) => {

            Activity.findByIdAndUpdate(
                req.params.activityId,
                {
                    $push: {comments: createdComment._id}
                }
            )
            .populate({
                path: 'comments',
                populate: { path: 'author'}
            })
            .then((updatedActivity) => {
                res.json(updatedActivity)
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