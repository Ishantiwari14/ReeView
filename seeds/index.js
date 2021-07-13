const { title, cities } = require('./helpers')
const Hotel = require('../models/hotels');

const mongoose = require('mongoose');
const { Schema } = mongoose;



const makeHotels = async () => {
    await Hotel.deleteMany({});
    for (i = 0; i < 50; i++) {
        const randomTitle = Math.floor(Math.random() * title.length)
        const randomCity = Math.floor(Math.random() * 50)

        const hotel = new Hotel({
            title: title[randomTitle],
            location: `${cities[randomCity].Headquarter}, ${cities[randomCity].District}`,
            price: Math.floor(Math.random() * 5000) + 500,
            image: 'https://source.unsplash.com/collection/10574893/',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, earum eius! Optio, doloribus, praesentium sint rerum at in aperiam, quos eius eum quae quas harum neque animi. Numquam, cum totam.'
        })
        await hotel.save();
    }
}

makeHotels();
