
module.exports.get_current_date = function() {
    var currentdate = new Date();
    var y = currentdate.getFullYear();
    var mon = currentdate.getMonth()+1;
    if(mon < 10) {
        mon = '0' + mon;
    }
    var d = currentdate.getDate();
    if(d < 10) {
        d = '0' + d;
    }
    var h = currentdate.getHours();
    if(h < 10) {
        h = '0' + h;
    }
    var min = currentdate.getMinutes();
    if(min < 10) {
        min = '0' + min;
    }
    var s = currentdate.getSeconds();
    if(s < 10) {
        s = '0' + s;
    }
    var datetime = y + '-' + mon + "-" + d + " " + h + ":" + min + ":" + s;
    return datetime;
};
module.exports.get_today = function() {
    var currentdate = new Date();
    var y = currentdate.getFullYear();
    var mon = currentdate.getMonth()+1;
    if(mon < 10) {
        mon = '0' + mon;
    }
    var d = currentdate.getDate();
    if(d < 10) {
        d = '0' + d;
    }
    var date = y + '-' + mon + "-" + d;
    return date;
};

module.exports.build_price_history = function(price_histories) {
    
    var result = '';
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null || price_histories.length == 0) {
        return result;
    }
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        result += new Date(price.date).getTime()+'-'+price.price+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.price;
    return result;
};

module.exports.build_see_history = function(price_histories) {
    
    var result = '';
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null || price_histories.length == 0) {
        return result;
    }
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        result += new Date(price.date).getTime()+'-'+price.see+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.see;
    return result;
};

module.exports.build_sold_history = function(price_histories) {
    
    var result = '';
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null || price_histories.length == 0) {
        return result;
    }
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        result += new Date(price.date).getTime()+'-'+price.sold+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.sold;
    return result;
};

module.exports.build_rating_history = function(price_histories) {
    
    var result = '';
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null || price_histories.length == 0) {
        return result;
    }
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        result += new Date(price.date).getTime()+'-'+price.rating+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.rating;
    return result;
};

module.exports.build_booking_min_history = function(price_histories) {
    
    var result = '';
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null || price_histories.length == 0) {
        return result;
    }
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        result += new Date(price.date).getTime()+'-'+price.booking_min+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.booking_min;
    return result;
};

module.exports.build_reviews_history = function(price_histories) {
    
    var result = '';
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null || price_histories.length == 0) {
        return result;
    }
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        result += new Date(price.date).getTime()+'-'+price.reviews+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.reviews;
    return result;
};

module.exports.build_discussion_history = function(price_histories) {
    
    var result = '';
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null || price_histories.length == 0) {
        return result;
    }
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        result += new Date(price.date).getTime()+'-'+price.discussion+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.discussion;
    return result;
};

module.exports.sort_price_history = function(price_histories) {
    var result = [];
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
        var arr = price.date.split('-');
        var min_date = new Date(arr[0], parseInt(arr[1]) - 1, arr[2]);
        for(var j=i+1; j<price_histories.length;j++) {
            var price_to = price_histories[j];
            var arr_to = price_to.date.split('-');
            var to_date = new Date(arr_to[0], parseInt(arr_to[1]) - 1, arr_to[2]);
            if(min_date > to_date) {
                var tmp = price_histories[j];
                price_histories[j] = price_histories[i];
                price_histories[i] = tmp;
            }
        }
        result.push(price_histories[i]);
    }
    result.push(price_histories[price_histories.length - 1]);
    return result;
};

module.exports.write_log = function(req,id,domain) {
    var product_id = domain+'_'+id;
    var Log = require('../models/log');
    require('getmac').getMac(function(err,macAddress){
        if (!err){
            var getIP = require('ipware')().get_ip;
            var ipInfo = getIP(req);
            var ipAddress = ipInfo.clientIp.replace(/[^0-9\.]*/, '');
            var iplocation = require('iplocation');
//            iplocation(ipAddress, function (error, res) {
//                var logData = {
//                    product_id: product_id,
//                    id: id,
//                    domain: domain,
//                    ipAddress: ipAddress,
//                    macAddress: macAddress,
//                    city: res.city,
//                    country: res.country_name,
//                    countryCode: res.country_code
//                };
//                if (req.session.hasOwnProperty("userEmail")) {
//                    logData['userEmail'] = req.session.userEmail;
//                }
//                else{
//                    logData['userEmail'] = null;
//                }
//                if (req.session.hasOwnProperty("userId")) {
//                    logData['userId'] = req.session.userId;
//                }
//                else{
//                    logData['userId'] = null;
//                }
//                Log.create(logData, function (error, log) {
//                });
//            });
            
        }
    //            if ( require('getmac').isMac("e4:ce:8f:5b:a7:fc") ) {
    });
};

