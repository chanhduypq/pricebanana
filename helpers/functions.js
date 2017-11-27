
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
    if(price_histories == '' || typeof(price_histories) == 'undefined' || price_histories == null) {
        return result;
    }
    for(var i=0; i<price_histories.length;i++) {
        var price = price_histories[i];
        result += price.date+'-'+price.price+'_';
    }
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