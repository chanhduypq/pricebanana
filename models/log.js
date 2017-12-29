var mongoose = require('mongoose');
var helper = require('../helpers/functions');

var LogSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        trim: true
    },
    ipAddress: {
        type: String,
        trim: true
    },
    macAddress: {
        type: String,
        trim: true
    },
    product_id: {
        type: String,
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
    createdDate: {
        type: Date,
        default:Date.now
    }    
});

LogSchema.pre('save', function (next) {
    var log = this;
    next();
});


var Log = mongoose.model('Log', LogSchema);
module.exports = Log;

