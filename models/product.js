var mongoose = require('mongoose');
var helper = require('../helpers/functions');

var ProductSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    price_history: {
        type: String,
        trim: true
    },
    other_price_history: {
        type: String,
        trim: true
    },
    see_history: {
        type: String,
        trim: true
    },
    sold_history: {
        type: String,
        trim: true
    },
    booking_min_history: {
        type: String,
        trim: true
    },
    reviews_history: {
        type: String,
        trim: true
    },
    discussion_history: {
        type: String,
        trim: true
    },
    createdDate: {
        type: Date
    },
    current_price: {
        type: Number
    },
    item_type_labels: {
        type: String
    }
});

ProductSchema.pre('save', function (next) {
    var product = this;
    if(typeof product.createdDate == 'undefined' || product.createdDate == null) {
        product.createdDate = helper.get_today();
    }
    next();
});

var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;

