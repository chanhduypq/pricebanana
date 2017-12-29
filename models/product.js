var mongoose = require('mongoose');
var helper = require('../helpers/functions');

var ProductSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    id: {
        type: String,
        trim: true
    },
    domain: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    price_history: {
        type: String,
        trim: true
    },
    see_history: {
        type: String,
        trim: true
    },
    rating_history: {
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
    },
    seller_name: {
        type: String
    },
    seller_url: {
        type: String
    },
    transaction_success: {
        type: String
    },
    item_sold: {
        type: String
    },
    talk_response_rate: {
        type: String
    },
    talk_response_time: {
        type: String
    },
    message_response_rate: {
        type: String
    },
    message_response_time: {
        type: String
    },
    shipment_support: {
        type: String
    },
    location_of_shop: {
        type: String
    },
    condition: {
        type: String
    },
    insurance: {
        type: String
    },
    weight: {
        type: String
    },
    current_review_count: {
        type: String
    },
    current_rating_count: {
        type: String
    },
    current_number_of_talk_about: {
        type: String
    },
    last_updated_price: {
        type: String
    },
    product_category: {
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

