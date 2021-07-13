const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Hotel = require('../models/hotels');
const flash = require('connect-flash')
const { hotelsSchema, reviewSchema } = require('../schemas.js')

const validateHotel = (req, res, next) => {
    const { error } = hotelsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels })
}))

router.get('/new', (req, res) => {
    res.render('hotels/new')
})

router.post('/', validateHotel, catchAsync(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
    req.flash('success', 'Successfully added a new Hotel')

    res.redirect(`/hotels/${hotel._id}`)

}))



router.get('/:id', catchAsync(async (req, res) => {

    const hotel = await Hotel.findById(req.params.id).populate('reviews')
    res.render('hotels/show', { hotel })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id)
    res.render(`hotels/edit`, { hotel })

}))

router.put('/:id', validateHotel, catchAsync(async (req, res) => {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body.hotel);
    req.flash('success', 'Successfully updated the Hotel')

    res.redirect(`/hotels/${hotel._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {

    await Hotel.findByIdAndDelete(req.params.id);
    res.redirect('/hotels')

}))

module.exports = router
