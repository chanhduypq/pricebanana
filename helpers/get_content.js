
module.exports.get_info_from_qoo10 = function (html,inventoryList) {
    var sell_price = null;
    var retail_price = null;
    var time_sell_price = null;
    
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var dl_sell_price = dom.getElementById('dl_sell_price');
    if (dl_sell_price == null) {
        
        temp = dom.getElementsByClassName("infoArea");
        if(temp.length>0){
            temp=temp[0].getElementsByClassName('infoData');
            for(i=0;i<temp.length;i++){
                dls = temp[i].getElementsByTagName('dl');
                for(j=0;j<dls.length;j++){
                    if(dls[j].innerHTML.indexOf('Q-Price')!=-1){
                        sell_price = dls[j].innerHTML.replace('Q-Price', '');
                        sell_price = sell_price.trim();
                        sell_price = parseFloat(sell_price.replace(/[^0-9\.]*/, ''));
                    }
                }
            }
            if (sell_price == null) {
                strongs = temp[1].getElementsByTagName('strong');
                sell_price = strongs[0].getAttribute('data-price');
            }
        }
        else{
            temp=dom.getElementsByClassName('detailsArea');
            strongs = temp[0].getElementsByTagName('strong');
            sell_price = strongs[0].getAttribute('data-price');
        }
        
    }
    else{
        strongs=dl_sell_price.getElementsByTagName('strong');
        sell_price = strongs[1].getAttribute('data-price');
    }
    var div_retailPrice = dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_retailPricePanel');
    if (div_retailPrice == null) {
        temp = dom.getElementsByClassName("infoArea");
        if(temp.length>0){
            temp=temp[0].getElementsByClassName('infoData');
            for(i=0;i<temp.length;i++){
                dls = temp[i].getElementsByTagName('dl');
                for(j=0;j<dls.length;j++){
                    if(dls[j].innerHTML.indexOf('Retail Price')!=-1){
                        retail_price = dls[j].innerHTML.replace('Retail Price', '');
                        retail_price = retail_price.trim();
                        retail_price = parseFloat(retail_price.replace(/[^0-9\.]*/, ''));
                    }
                }
            }
        }
        else{
            temp=dom.getElementsByClassName('detailsArea');
            dels = temp[0].getElementsByTagName('del');
            retail_price = dels[0].innerHTML;
            retail_price = retail_price.replace("$", "");
        }
        
        
    } else {
        dds = div_retailPrice.getElementsByTagName('dd');
        dd = dds[0];
        retail_price = dd.innerHTML;
        retail_price = retail_price.replace("$", "");
    }

    var span_time_sell_price = dom.getElementById('ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_discount_info');
    if (span_time_sell_price == null) {
        time_sell_price = null;
    } else {
        strongs=span_time_sell_price.getElementsByTagName('strong');
        if(strongs.length>0){
            time_sell_price = strongs[1].innerHTML;
            time_sell_price = time_sell_price.replace("$", "");
        }
    }
    
    var item_types = get_item_types(inventoryList,sell_price);
    var item_type_labels = get_item_type_labels(inventoryList);
    
    return {sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types,item_type_labels:item_type_labels};
};

function get_item_type_labels(inventoryList){
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(inventoryList);
    var item_type_labels = null;
    item_type_labels = [];
    dts=dom.getElementsByTagName('dt');
    for(i=0;i<dts.length;i++){
        strongs=dts[i].getElementsByTagName('strong');
        if(strongs.length==0){
            temp=dts[i].innerHTML;
            temp=temp.replace('∙ ','');
            item_type_labels.push(temp);
        }

    }
    return JSON.stringify(item_type_labels);
//    var table=dom.getElementsByTagName('table');
//    
//    if (table.length>0) {
//        item_type_labels = [];
//        theads=table[0].getElementsByTagName('thead');
//        thead=theads[0];
//        spans = thead.getElementsByTagName('span');
//        for(i=0;i<spans.length-2;i++){
//            item_type_labels.push(spans[i].innerHTML);
//        }
//        return JSON.stringify(item_type_labels);
//    }
//    else{
//        item_type_labels = [];
//        dts=dom.getElementsByTagName('dt');
//        for(i=1;i<dts.length;i++){
//            strongs=dts[i].getElementsByTagName('strong');
//            if(strongs.length==0){
//                temp=dts[i].innerHTML;
//                item_type_labels.push(temp.replace('. ',''));
//            }
//            else{
//                temp=strongs[0].innerHTML;
//                item_type_labels.push(temp);
//            }
//            
//        }
//        return JSON.stringify(item_type_labels);
//    }
    return item_type_labels;
}

function get_item_types(inventoryList,sell_price){
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(inventoryList);
    var item_types = null;
    var tb_OptAllVw_op_list=dom.getElementById('tb_OptAllVw_op_list');
    if (tb_OptAllVw_op_list != null) {
        item_types=[];
        trs=tb_OptAllVw_op_list.getElementsByTagName('tr');
        for(i=0;i<trs.length;i++){
            spans = trs[i].getElementsByTagName('span');
            quantity='';
            price='';
            name='';
            if (spans.length == 5) {
                quantity = spans[4].innerHTML;
                price = spans[3].innerHTML;
                price = price.replace('$', '');
                if (price[0] == '+') {
                    price = parseFloat(sell_price) + parseFloat(price.substr(1));
                } else if (price[0] == '-') {
                    price = parseFloat(sell_price) - parseFloat(price.substr(1));
                } else {
                    price = parseFloat(sell_price);
                }
                name = spans[1].innerHTML;
            }
            
            var obj = {name:name,quantity:quantity,price:price};
            item_types.push(obj);
        }
        return JSON.stringify(item_types);
    }
    else{
        content_inventory_0=dom.getElementById('content_inventory_0');
        if (content_inventory_0 != null) {
            item_types=[];
            spans = content_inventory_0.getElementsByTagName('span');
            for(i=0;i<spans.length;i++){
                html=spans[i].innerHTML;
                if(html.indexOf('- Qty')!=-1){
                    temp=html.split('(');
                    name=temp[0];
                    temp=temp[1].split(')');
                    price=temp[0];
                    temp=temp[1].split('Qty : ');
                    quantity=temp[1];
                    price = price.replace('$', '');
                    if (price[0] == '+') {
                        price = parseFloat(sell_price) + parseFloat(price.substr(1));
                    } else if (price[0] == '-') {
                        price = parseFloat(sell_price) - parseFloat(price.substr(1));
                    } else {
                        price = parseFloat(price);
                    }
                }
            }
            return JSON.stringify(item_types);
        }
        
    }
    
    return item_types;
}

module.exports.get_info_from_lazada = function (html) {
    var sell_price = null;
    var retail_price = null;
    var time_sell_price = null;
    
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var special_price_box = dom.getElementById('special_price_box');
    if (special_price_box != null) {
        special_price_box = special_price_box.innerHTML;
        sell_price = parseFloat(special_price_box.replace(/[^0-9\.]*/, ''));
    }

    var price_box = dom.getElementById('price_box');
    if (price_box != null) {
        price_box = price_box.innerHTML;
        retail_price = parseFloat(price_box.replace(/[^0-9\.]*/, ''));
    }
    var item_types = null;
    var item_type_labels =null;
    return {sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types,item_type_labels:item_type_labels};
};

module.exports.get_info_from_shopee = function (html) {
    var sell_price = null;
    var retail_price = null;
    var time_sell_price = null;
    
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var special_price_box = dom.getElementsByClassName('shopee-product-info__header__real-price');
    if (special_price_box.length>0) {
        special_price_box=special_price_box[0];        
        special_price_box = special_price_box.innerHTML;
        for(i=0;i<special_price_box.length;i++){
            if(special_price_box[i]=='$'){
                sell_price='';
                for(j=i+1;j<special_price_box.length;j++){
                    if(special_price_box[j]=='.'||isFinite(special_price_box[j])){
                        sell_price+=special_price_box[j];
                    }
                    else{
                        break;
                    }
                }
                break;
            }
        }
    }

    var item_types = null;
    var item_type_labels =null;
    
    return {sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types,item_type_labels:item_type_labels};
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