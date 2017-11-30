
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
                    sendMail(temp.user_id,temp.tracked_price,sell_price);
                }
            }
        }

    });
};

function sendMail(user_id,tracked_price,sell_price) {
    console.log(user_id + ' '+tracked_price+' '+sell_price);
    var nodemailer = require('nodemailer');
//    var transporter = nodemailer.createTransport({
//        service: 'gmail',
//        auth: {
//            user: 'chanhduypq@gmail.com',
//            pass: '0812buddha'
//        }
//    });
    var transporter = nodemailer.createTransport('smtps://chanhduypq@gmail.com:0812buddha');
//    var transporter = nodemailer.createTransport({
//        host: 'smtp.gmail.com',
//        port: 465,
//        secure: true, // use SSL
//        auth: {
//            user: 'chanhduypq@gmail.com',
//            pass: '0812buddha'
//        }
//    });
    var mailOptions = {
        from: 'chanhduypq@gmail.com',
        to: 'tue@24x7studios.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}