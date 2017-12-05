var mongoose = require('mongoose');
var helper = require('../helpers/functions');

var UrlContentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        trim: true
    },
    createdDate: {
        type: Date
    },
    item_types: {
        type: String,
        trim: true
    }
});

UrlContentSchema.pre('save', function (next) {
    var urlContent = this;
    if(typeof urlContent.createdDate == 'undefined' || urlContent.createdDate == null) {
        urlContent.createdDate = helper.get_today();
    }
    next();
});

var UrlContent = mongoose.model('UrlContent', UrlContentSchema);
module.exports = UrlContent;

