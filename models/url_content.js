var mongoose = require('mongoose');
var helper = require('../helpers/functions');

var UrlContentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdDate: {
        type: String
    }
});

UrlContentSchema.pre('save', function (next) {
    var urlContent = this;
    if(typeof urlContent.createdDate == 'undefined' || urlContent.createdDate == null) {
        urlContent.createdDate = helper.get_current_date();
    }
    next();
});

var UrlContent = mongoose.model('UrlContent', UrlContentSchema);
module.exports = UrlContent;

