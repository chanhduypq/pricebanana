
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
    for(var i=0; i<price_histories.length-1;i++) {
        var price = price_histories[i];
//        result += price.date+'-'+price.price+'_';
        result += new Date(price.date).getTime()+'-'+price.price+'_';
    }
    price = price_histories[price_histories.length-1];
    result += new Date(price.date).getTime()+'-'+price.price;
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

module.exports.get_info_from_html = function(html) {
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var dl_sell_price=dom.getElementById('dl_sell_price');
    var sell_price = dl_sell_price.childNodes[1].childNodes[0].getAttribute('data-price');
    
    var div_retailPrice=dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_retailPricePanel');
    var retail_price = div_retailPrice.childNodes[0].childNodes[1].innerHTML;
    retail_price=retail_price.replace("$","");
    
    var span_time_sell_price=dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_discount_info');
    var time_sell_price = span_time_sell_price.childNodes[0].childNodes[1].childNodes[0].innerHTML;
    time_sell_price=time_sell_price.replace("$","");
    
    return {sell_price:sell_price,retail_price:retail_price,time_sell_price:time_sell_price};    
};