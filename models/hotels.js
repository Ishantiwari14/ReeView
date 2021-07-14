const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./reviews')

mongoose.connect('mongodb://localhost:27017/reviewApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Successfully connected to mongoose database")

    })
    .catch((err) => {
        console.log('Error connecting to mongoose database')
    })

const hotelsSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Name is required'],
        min: 0,

    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String,
        required: [true, 'Provide Images']
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

hotelsSchema.post('findOneAndDelete', async function (doc) {

    await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })
})

const Hotel = new mongoose.model('Hotel', hotelsSchema)

module.exports = Hotel

