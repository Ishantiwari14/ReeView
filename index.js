const express = require('express');
const app = express();
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose')


const hotels = require('./routes/hotels')
const reviews = require('./routes/review')

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ('views')));
const sessionOptions = {
    secret: 'thisisnotagreatsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(flash())
app.use(session(sessionOptions))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/hotels', hotels)
app.use('/hotels/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.redirect('/hotels')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    // const { status = 500, message = 'Something went Wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something went Wrong!'
    res.status(status).render('error', { err })
})

app.listen(3000, () => {
    console.log('Starting at port 3000')
})
