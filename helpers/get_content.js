
module.exports.get_info_from_html = function (html) {
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var dl_sell_price = dom.getElementById('dl_sell_price');
    if (dl_sell_price == null) {
        sendError();
        return {sell_price: null, retail_price: null, time_sell_price: null};
    }
    strongs=dl_sell_price.getElementsByTagName('strong');
    var sell_price = strongs[1].getAttribute('data-price');

    var div_retailPrice = dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_retailPricePanel');
    if (div_retailPrice == null) {
        var retail_price = null;
    } else {
        dds = div_retailPrice.getElementsByTagName('dd');
        dd = dds[0];
        var retail_price = dd.innerHTML;
        retail_price = retail_price.replace("$", "");
    }

    var span_time_sell_price = dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_discount_info');
    if (span_time_sell_price == null) {
        var time_sell_price = null;
    } else {
        strongs=span_time_sell_price.getElementsByTagName('strong');
        var time_sell_price = strongs[1].innerHTML;
        time_sell_price = time_sell_price.replace("$", "");
    }
    
    var ul_content_inventory_0 = dom.getElementById('content_inventory_0');
    if (ul_content_inventory_0 == null) {
        var item_types = null;
    } else {
        var nodes = ul_content_inventory_0.getElementsByTagName('span');
        item_types=[];
        for(i=0;i<nodes.length;i++){
            text=nodes[i].innerHTML;
            temp=text.split(' - Qty : ');
            text=temp[0];
            quantity=temp[1];
            if(text.indexOf('(')!=-1){
                temp=text.split('(');
                name=temp[0];
                temp=temp[1];
                temp=temp.replace('$','');
                temp=temp.replace(')','');
                price=parseFloat(temp.substr(1));
                if(temp[0]=='+'){
                    price=parseFloat(time_sell_price)+price;                    
                }
                else{
                    price=parseFloat(time_sell_price)-price;    
                }
            }
            else{
                name=text;
                price=time_sell_price;  
            }
            var obj = {name:name,quantity:quantity,price:price};
            item_types.push(obj);
        }
        item_types=JSON.stringify(item_types);
    }
    return {sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types};
};

module.exports.send_mail_for_tracking_price_fixed = function (product_id, sell_price) {
    var TrackingPrice = require('../models/tracking_price');
    TrackingPrice.find({product_id: product_id}, function (error, allTrackingPrice) {
        if (error) {

        } else {
            for (i = 0; i < allTrackingPrice.length; i++) {
                temp = allTrackingPrice[i];
                if (sell_price <= temp.tracked_price) {
                    sendMail(temp.user_email,temp.tracked_price,sell_price);
                }
            }
        }

    });
};

module.exports.get_domain_and_id_from_url = function (url) {
    url = url.replace('https://www.', '');
    temp = url.split('/');
    id = temp[temp.length - 1];
    temp = temp[0].split('.');
    domain = temp[0];
    return {'domain': domain, 'id': id};
};

function sendMail(user_email,tracked_price,sell_price) {
    var config = require('../config');
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: true, // use SSL
        auth: {
            user: config.user,
            pass: config.pass
        }
    });
    var mailOptions = {
        from: 'tue@24x7studios.com',
        to: user_email,
        subject: 'Notification',
        text: 'ok'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function sendError() {
    var config = require('../config');
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: true, // use SSL
        auth: {
            user: config.user,
            pass: config.pass
        }
    });
    var mailOptions = {
        from: 'tue@24x7studios.com',
        to: 'chanhduypq@gmail.com',
        subject: 'Error',
        text: 'Error'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}