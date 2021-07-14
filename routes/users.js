const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.flash('success', 'Welcome!!')
        res.redirect('/hotels');
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/hotels')
})

module.exports = router;