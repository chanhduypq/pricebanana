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
    createdDate: {
        type: String
    },
    current_price: {
        type: String
    }
});

ProductSchema.pre('save', function (next) {
    var product = this;
    if(typeof product.createdDate == 'undefined' || product.createdDate == null) {
        product.createdDate = helper.get_current_date();
    }
    next();
});

var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;

