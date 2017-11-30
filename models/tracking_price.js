var mongoose = require('mongoose');

var TrackingPriceSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    user_email: {
        type: String,
        required: true,
        trim: true
    },
    tracked_price:{
        type: Number,
        required: true
    }
});

TrackingPriceSchema.pre('save', function (next) {
    next();
});

var TrackingPrice = mongoose.model('TrackingPrice', TrackingPriceSchema);
module.exports = TrackingPrice;

