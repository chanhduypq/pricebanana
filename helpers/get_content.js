
module.exports.get_info_from_qoo10 = function (html,inventoryList) {
    var name = null;
    var sell_price = null;
    var retail_price = null;
    var time_sell_price = null;
    var clone = null;
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
            if (sell_price == null && temp.length > 1) {
                strongs = temp[1].getElementsByTagName('strong');
                if(strongs.length>0){
                    sell_price = strongs[0].getAttribute('data-price');
                }
                
            }
        }
        else{
            temp=dom.getElementsByClassName('detailsArea');
            if(temp.length>0){
                strongs = temp[0].getElementsByTagName('strong');
                if(strongs.length>0){
                    sell_price = strongs[0].getAttribute('data-price');
                }
                
            }
            
        }
        
    }
    else{
        strongs=dl_sell_price.getElementsByTagName('strong');
        if(strongs.length>1){
            sell_price = strongs[1].getAttribute('data-price');
        }
        
    }
    if(sell_price==null){
        grpbuy_area=dom.getElementsByClassName('grpbuy_area');
        if(grpbuy_area.length>0){
            grpbuy_area=grpbuy_area[0];//prc
            prc=grpbuy_area.getElementsByClassName('prc');
            if(prc.length>0){
                strongs=prc[0].getElementsByTagName('strong');
                if(strongs.length>0){
                    sell_price = strongs[0].getAttribute('data-price');
                }
            }
            
        }
        
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
            if(temp.length>0){
                dels = temp[0].getElementsByTagName('del');
                if(dels.length>0){
                    retail_price = dels[0].innerHTML;
                    retail_price = retail_price.replace("$", "");
                }
                
            }
            
        }
        
        
    } else {
        dds = div_retailPrice.getElementsByTagName('dd');
        if(dds.length>0){
            dd = dds[0];
            retail_price = dd.innerHTML;
            retail_price = retail_price.replace("$", "");
        }
        
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
    
    
    var item_type_labels = get_item_type_labels(inventoryList);
    var item_types = get_item_types(inventoryList,sell_price,item_type_labels);
    
    node = dom.getElementById('goods_name');
    if (node != null) {
        name = node.innerHTML;
    }
    
    return {name: name, sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types,item_type_labels:item_type_labels};
};

function get_item_type_labels(inventoryList){
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(inventoryList);
    var item_type_labels = [];
    dts = dom.getElementsByTagName('dt');
    for(i=0;i<dts.length;i++){
        strongs = dts[i].getElementsByTagName('strong');
        if (strongs.length == 0) {
            temp = dts[i].innerHTML;
            temp = temp.replace('∙ ', '');
            item_type_labels.push(temp);
        }

    }
    if (item_type_labels.length > 0) {
        return JSON.stringify(item_type_labels);
    } else {
        return null;
    }
    

}

function get_item_types(inventoryList,sell_price,item_type_labels){
    item_type_labels = JSON.parse(item_type_labels);
    
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(inventoryList);
    var item_types = {};
    var inventoryListOther=dom.getElementById('inventoryListOther');
    if(inventoryListOther!=null){
        json = JSON.parse(inventoryListOther.innerHTML);
        for(i=0;i<json.length;i++){
            temp=json[i].GoodsAddInfo;
            for(j=0;j<temp.length;j++){
                key = temp[j].sel_value;
                quantity = temp[j].remain_cnt;
                price = parseFloat(temp[j].sel_item_price);
                price = parseFloat(sell_price) + price;
                price=price.toFixed(2);
                
                item_types[key]={quantity:quantity,price:price};
            }
        }
    }
    else{
        var tb_OptAllVw_op_list=dom.getElementById('tb_OptAllVw_op_list');
        if (tb_OptAllVw_op_list != null) {
            trs=tb_OptAllVw_op_list.getElementsByTagName('tr');
            for(i=0;i<trs.length;i++){
                spans = trs[i].getElementsByTagName('span');

                quantity = spans[item_type_labels.length+1].innerHTML;
                price = spans[item_type_labels.length].innerHTML;
                price = price.replace('$', '');
                if (price[0] == '+') {
                    price = parseFloat(sell_price) + parseFloat(price.substr(1));
                } else if (price[0] == '-') {
                    price = parseFloat(sell_price) - parseFloat(price.substr(1));
                } else {
                    price = parseFloat(sell_price);
                }

                price=price.toFixed(2);

                key='';
                for(j=0;j<item_type_labels.length-1;j++){
                    key+=spans[j].innerHTML+"|";

                }
                key+=spans[item_type_labels.length-1].innerHTML;
                item_types[key]={quantity:quantity,price:price};
            }
        }
        else{
            content_inventory_0=dom.getElementById('content_inventory_0');
            if (content_inventory_0 != null) {
                spans=content_inventory_0.getElementsByTagName('span');
                for(i=0;i<spans.length;i++){
                    html=spans[i].innerHTML;
                    if(html.indexOf('- Qty')!=-1){
                        if(html.indexOf('$')!=-1){
                            temp = html.split(' - Qty : ');
                            html = temp[0];
                            quantity = temp[1];

                            temp=html.split('$');
                            price=temp[1].replace(')','');
                            if (temp[0][temp[0].length-1] == '+') {
                                price = parseFloat(sell_price) + parseFloat(price);
                                name=temp[0].replace('(+','');
                            } else if (temp[0][temp[0].length-1] == '-') {
                                price = parseFloat(sell_price) - parseFloat(price);
                                name=temp[0].replace('(-','');
                            } else {
                                price = parseFloat(price);
                                name=temp[0].replace('(','');
                            }

                        }
                        else{
                            temp = html.split('- Qty : ');
                            price = parseFloat(sell_price);
                            name = temp[0];
                            quantity = temp[1];
                        }



                    }
                    else{
                        quantity=0;
                        price = parseFloat(sell_price);
                        name=html.replace('- Sold Out','');
                    }
                    price=price.toFixed(2);                    
                    item_types[name]={quantity:quantity,price:price};

                }

            }

        }
    }
    
    
    
    return item_types;
}

module.exports.get_info_from_lazada = function (html) {
    var name = null;
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
    
    node = dom.getElementById('prod_title');
    if (node != null) {
        name = node.innerHTML;
    }
    return {name: name, sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types,item_type_labels:item_type_labels};
};

module.exports.get_info_from_shopee = function (html) {
    var name = null;
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
    
    node = dom.getElementsByClassName('shopee-product-info__header__text');
    if (node.length > 0) {
        name = node[0].innerHTML;
    }
    
    return {name: name, sell_price: sell_price, retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types,item_type_labels:item_type_labels};
};

module.exports.get_info_from_tokopedia = function (html) {
    var name = null;
    var last_updated_price = null;
    var product_category = '';
    var sell_price = null;
    var retail_price = null;
    var time_sell_price = null;
    var item_types = {};
    var item_type_labels =[];
    var sold = null;
    var booking_min = null;
    var reviews = null;
    var discussion = null;
    var rating = null;
    var seller_name = null;
    var seller_url = null;
    var transaction_success = null;
    var item_sold = null;
    var talk_response_rate = null;
    var talk_response_time = null;
    var message_response_rate = null;
    var message_response_time = null;
    var shipment_support = null;
    var location_of_shop = null;
    var condition = null;
    var insurance = null;
    var weight = null;
    var current_review_count = null;
    var current_rating_count = null;
    var current_number_of_talk_about = null;
    
    var DomParser = require('dom-parser');
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var product_pricetag = dom.getElementsByClassName('product-pricetag');
    if (product_pricetag.length>0) {
        product_pricetag = product_pricetag[0];
        spans=product_pricetag.getElementsByTagName('span');
        if (spans.length>1) {
            sell_price=spans[1].innerHTML.replace('.', '');
            sell_price=sell_price.replace('.', '');
        }
        
    }
    
    uls = dom.getElementsByClassName('product-ratingstat');
    ul=uls[0];
    quantities=ul.getElementsByClassName('product-ratingstat_quantity');
    prices=ul.getElementsByClassName('bold');
    for(i=0;i<quantities.length;i++){
        item_type_labels.push(quantities[i].innerHTML);
        price=prices[i].innerHTML;
        price=price.replace(/[^0-9]+/g, '');
        item_types[quantities[i].innerHTML]={price:price};
    }  
    item_type_labels=JSON.stringify(item_type_labels);
    
    nodes=dom.getElementsByClassName('item-sold-count');
    sold=nodes[0].innerHTML.replace(/[^0-9\.]+/g, '');
    if(sold.trim()==''){
        sold='0';
    }
    node=dom.getElementById('p-info-minorder');
    booking_min=node.innerHTML.replace(/[^0-9\.]+/g, '');
    
    nodes=dom.getElementsByClassName('product-pricelastupdated');
    if(nodes.length>0){
        nodes=nodes[0].getElementsByTagName('i');
        if(nodes.length>0){
            last_updated_price=nodes[0].innerHTML.replace('Perubahan Harga Terakhir: ','');
        }
    }
    
    node=dom.getElementById('breadcrumb-container');
    if(node!=null){
        nodes=node.getElementsByTagName('li');
        for(i=1;i<nodes.length-1;i++){
            node=nodes[i].getElementsByTagName('a');
            if(node.length>0){
                product_category+=node[0].innerHTML+"->";
            }
        }
        product_category=product_category.substr(0,product_category.length-2);
        find1 = '&amp;';
        re1 = new RegExp(find1, 'g');
        product_category = product_category.replace(re1, '&');        
    }
    
    

    
    node=dom.getElementById('p-nav-review');
    spans=node.getElementsByTagName('span');
    if(spans.length>0){
        reviews=spans[0].innerHTML.replace(/[^0-9\.]+/g, '');
    }
    else{
        reviews='0';
    }
    
    node=dom.getElementById('p-nav-talk');
    spans=node.getElementsByTagName('span');
    if(spans.length>0){
        discussion=spans[0].innerHTML.replace(/[^0-9\.]+/g, '');
        current_number_of_talk_about=discussion;
    }
    else{
        discussion='0';
    }
    
    node=dom.getElementsByClassName('rate-accuracy');
    if(node.length>0){
        node = node[0];
        ps = node.getElementsByTagName('p');
        if (ps.length > 0) {
            rating = ps[0].innerHTML.replace(/[^0-9\.]+/g, '');
            rating = rating.substr(0, 3);
        } else {
            rating = '0';
        }
    }
    else{
        rating='0';
    }
    
    node = dom.getElementsByClassName('product-title');
    if (node.length > 0) {
        node = node[0].getElementsByTagName('a');
        if (node.length > 0) {
            name = node[0].innerHTML;
        }
    }
    
    nodes=dom.getElementById('p-info-weight');
    if(nodes!=null){
        weight=nodes.innerHTML.trim();
    }
    
    nodes=dom.getElementById('p-info-insurance');
    if(nodes!=null){
        insurance=nodes.innerHTML.trim();
    }
    
    nodes=dom.getElementById('p-info-condition');
    if(nodes!=null){
        condition=nodes.innerHTML.trim();
    }
    
    node = dom.getElementsByClassName('pengiriman');
    if(node.length>0){
        uls=node[0].getElementsByTagName('ul');
        if(uls.length>0){
            shipment_support='<ul class="product-ratingstat mt-0 p-10">'+uls[0].innerHTML.replace(/(\r\n|\n|\r)/gm,"")+'</ul>';
        }
        
    }
    
    node = dom.getElementsByClassName('product-box-content');
    if(node.length>1){
        node=node[1];
        spans=node.getElementsByTagName('span');
        if(spans.length>2){
            location_of_shop=spans[2].innerHTML;
        }
    }
    
    nodes=dom.getElementById('shop-item-sold-v2');
    if(nodes!=null){
        item_sold=nodes.innerHTML.trim();
    }
    
    node = dom.getElementsByClassName('transaction-info');
    if(node.length>0){
        node=node[0];
        node=node.getElementsByTagName('strong');
        if(node.length>0){
            transaction_success=node[0].innerHTML;
        }
    }
    
    nodes=dom.getElementById('shop-name-info');
    if(nodes!=null){
        seller_url=nodes.getAttribute('href');
        seller_name=nodes.innerHTML;
    }
    
    node = dom.getElementsByClassName('reviewsummary-loop');
    if(node.length>0){
        node=node[0];
        node=node.getElementsByClassName('mt-5');
        if(node.length>1){
            current_review_count=node[1].innerHTML.replace(/[^0-9]+/g, '');
            current_rating_count=current_review_count;
        }
    }
    
    
    nodes=dom.getElementById('seller-message-response-time');
    if(nodes!=null){
        message_response_time=nodes.innerHTML;
    }
    
    nodes=dom.getElementById('seller-message-response-rate');
    if(nodes!=null){
        message_response_rate=nodes.innerHTML;
    }
    
    nodes=dom.getElementById('seller-response-time');
    if(nodes!=null){
        talk_response_time=nodes.innerHTML;
    }
    
    nodes=dom.getElementById('seller-response-rate');
    if(nodes!=null){
        talk_response_rate=nodes.innerHTML;
    }
    
    
    return {last_updated_price: last_updated_price,product_category: product_category,seller_name: seller_name,seller_url: seller_url,transaction_success: transaction_success,item_sold: item_sold,talk_response_rate: talk_response_rate,talk_response_time: talk_response_time,message_response_rate: message_response_rate,message_response_time: message_response_time,shipment_support: shipment_support,location_of_shop: location_of_shop,condition: condition,insurance: insurance,weight: weight,current_review_count: current_review_count,current_rating_count: current_rating_count,current_number_of_talk_about: current_number_of_talk_about,name: name, reviews: reviews,rating: rating,discussion: discussion,sold: sold,sell_price: sell_price,booking_min: booking_min,retail_price: retail_price, time_sell_price: time_sell_price,item_types:item_types,item_type_labels:item_type_labels};
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