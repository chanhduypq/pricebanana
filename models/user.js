var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var helper = require('../helpers/functions');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    passwordConf: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default:Date.now
    },
    is24x7: {
        type: String
    }
    
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email }).exec(function (err, user) {
        if (err) {
            return callback(err);
        } else if (!user) {
            err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
    });
};

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        var config = require('../config');
        if(config.email_24x7.indexOf(user.email) != -1) {
            user.is24x7='1';
        }
        else{
            user.is24x7='0';
        }
        next();
    });
});


var User = mongoose.model('User', UserSchema);
module.exports = User;

