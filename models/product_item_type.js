var mongoose = require('mongoose');
var helper = require('../helpers/functions');

var ProductItemTypeSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    item_type_history: {
        type: String,
        trim: true
    },
    clone_html_for_inventory_list: {
        type: String,
        trim: true
    }
});

ProductItemTypeSchema.pre('save', function (next) {
    next();
});

var ProductItemType = mongoose.model('ProductItemType', ProductItemTypeSchema);
module.exports = ProductItemType;

