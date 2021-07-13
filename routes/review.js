const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Hotel = require('../models/hotels');
const Review = require('../models/reviews');
const mongoose = require('mongoose')

const { hotelsSchema, reviewSchema } = require('../schemas.js')


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
router.post('/', validateReview, catchAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate('reviews');
    console.log(hotel)
    const review = new Review(req.body.review);

    hotel.reviews.push(review);
    await review.save();
    await hotel.save();

    req.flash('success', 'Added your review')
    res.redirect(`/hotels/${hotel._id}`)

}))

router.delete('/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hotels/${id}`)
})

module.exports = router