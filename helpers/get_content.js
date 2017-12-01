
module.exports.get_info_from_html = function (html) {
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var dl_sell_price = dom.getElementById('dl_sell_price');
    var sell_price = dl_sell_price.childNodes[1].childNodes[0].getAttribute('data-price');

    var div_retailPrice = dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_retailPricePanel');
    var retail_price = div_retailPrice.childNodes[0].childNodes[1].innerHTML;
    retail_price = retail_price.replace("$", "");

    var span_time_sell_price = dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_discount_info');
    var time_sell_price = span_time_sell_price.childNodes[0].childNodes[1].childNodes[0].innerHTML;
    time_sell_price = time_sell_price.replace("$", "");

    return {sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price};
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