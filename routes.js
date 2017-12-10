var User = require(__dirname + '/models/user');
var Product = require(__dirname + '/models/product');
var ProductItemType = require(__dirname + '/models/product_item_type');
var TrackingPrice = require(__dirname + '/models/tracking_price');
var UrlContent = require(__dirname + '/models/url_content');
var helper = require(__dirname + '/helpers/functions');
var helperGetContent = require(__dirname + '/helpers/get_content');
var helperBanana = require(__dirname + '/helpers/banana');
var config = require(__dirname + '/config');

module.exports = function(app){

    app.get('/banana/:domain/:id', function (req, res) {

        var domain = req.params.domain;        
        var id = req.params.id;
        if(config.domains.indexOf(domain) == -1) {
            return res.send('Wrong domain name');
        }
        var product_id = domain+'_'+id;
        if(req.session.hasOwnProperty("userEmail")){
            var user_email = req.session.userEmail;
        }
        else{
            var user_email = '';
        }
        
        if (domain == 'qoo10') {
            var is_qoo10 = '1';
        } else {
            var is_qoo10 = '0';
        }
        
        if (req.session.hasOwnProperty("userEmail") && req.session.is24x7=='1') {
            var is_show_quantity = '1';
        } else {
            var is_show_quantity = '0';
        }
        
        Product.findOne({product_id: product_id}, function (error, product) {  
            if (product === null) {
                return res.render('banana', {
                                price_history:[],
                                user_email: user_email,
                                current_price: 0,
                                tracked_price: 0,
                                isLogin: req.session.hasOwnProperty("userId"),
                                label_for_action_tracking: 'Start tracking',
                                is_qoo10:is_qoo10,
                                is_show_quantity:is_show_quantity
                            });
            }
            else{
                var price_histories = JSON.parse(product.price_history);
                var current_price = product.current_price;
                var tracked_price = current_price;
                
                TrackingPrice.findOne({product_id: product_id,user_id:req.session.userId}, function (error, trackingPrice) {
                        if (trackingPrice === null) {
                            ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
                                
                                return res.render('banana', {
                                    price_history:helper.build_price_history(price_histories),
                                    user_email: user_email,
                                    current_price: current_price,
                                    tracked_price: tracked_price,
                                    isLogin: req.session.hasOwnProperty("userId"),
                                    label_for_action_tracking: 'Start tracking',
                                    item_type_history: productItemType.item_type_history,
                                    item_type_labels:product.item_type_labels,
                                    is_qoo10:is_qoo10,
                                    is_show_quantity:is_show_quantity
                                });

                            });
                            
                        } else {
                            ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
                                tracked_price = trackingPrice.tracked_price;
                                return res.render('banana', {
                                    price_history:helper.build_price_history(price_histories),
                                    user_email: user_email,
                                    current_price: current_price,
                                    tracked_price: tracked_price,
                                    isLogin: req.session.hasOwnProperty("userId"),
                                    label_for_action_tracking: 'Update tracking',
                                    item_type_history: productItemType.item_type_history,
                                    item_type_labels:product.item_type_labels,
                                    is_qoo10:is_qoo10,
                                    is_show_quantity:is_show_quantity
                                });

                            });
                            
                        }


                });
            }
            
        });
    });
    
    app.get('/tracking/:domain/:id/:tracked_price', function (req, res) {
        var domain = req.params.domain;
        var id = req.params.id;
        var tracked_price = req.params.tracked_price;
        if(config.domains.indexOf(domain) == -1) {
            var obj = {success:false};
            return res.send(JSON.stringify(obj));
        }
        var product_id = domain+'_'+id;
        var user_id = req.session.userId;
        var user_email = req.session.userEmail;
        TrackingPrice.findOne({product_id: product_id,user_id:user_id}, function (error, trackingPrice) {
            if (error) {
                var obj = {success:false};
                return res.send(JSON.stringify(obj));
            } else {
                
                if (trackingPrice === null) {
                    var trackingPriceData = {
                        product_id: product_id,
                        user_id: user_id,
                        user_email: user_email,
                        tracked_price: tracked_price
                    };
                    TrackingPrice.create(trackingPriceData, function (error, trackingPrice) {
                        if (error) {
                            var obj = {success:false};
                            return res.send(JSON.stringify(obj));
                        } else {
                            var obj = {success:true};
                            return res.send(JSON.stringify(obj));
                        }
                    });
                } else {
                    TrackingPrice.findOneAndUpdate({ "_id" : trackingPrice._id }, {tracked_price: tracked_price}, function (err, product) {
                        if (error) {
                            var obj = {success:false};
                            return res.send(JSON.stringify(obj));
                        } else {
                            var obj = {success:true};
                            return res.send(JSON.stringify(obj));
                        }
                    });
                }
            }
        });
    });
    
    app.post('/get_content', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
        var url = req.body.url;
        var id = req.body.id;
        var domain = req.body.domain;
        if (domain == 'qoo10') {
            info = helperGetContent.get_info_from_qoo10(req.body.content, req.body.inventoryList);
        } else if (domain == 'lazada') {
            info = helperGetContent.get_info_from_lazada(req.body.content);
        } else if (domain == 'shopee') {
            info = helperGetContent.get_info_from_shopee(req.body.content);
        }



        var data = {
            domain: domain,
            id: id,
            content: req.body.content
        };
        today = helper.get_today();
        UrlContent.findOne({domain: domain,id:id,createdDate: today}, function (error, urlContent) {
            if (urlContent === null){
                
                UrlContent.create(data, function (error, urlContent) {
                });  

                var product_id = domain + "_" + id;
                Product.findOne({product_id: product_id}, function (error, product) {

                    if (product === null){
                        var price_histories = [
                            { date: today, price: info.sell_price}
                        ];                    
                        var productData = {
                            product_id: product_id,
                            price_history: JSON.stringify(price_histories),
                            current_price: info.sell_price,
                            item_type_labels: info.item_type_labels
                        };
                        Product.create(productData, function (error, product) {
                        });
                    } else {
                        var price_histories = JSON.parse(product.price_history);
                        var find = false;
                        for(var i=0; i<price_histories.length;i++) {
                            if(price_histories[i].date == today) {
                                price_histories[i].price = info.sell_price;
                                price_histories[i].item_types = info.item_types;
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            price_histories.push({date: today, price: info.sell_price});
                        }
                        price_history=helper.sort_price_history(price_histories);
                        current_price=price_history[price_history.length-1].price;

                        helperGetContent.send_mail_for_tracking_price_fixed(product_id,info.sell_price);

                        Product.findOneAndUpdate({ "_id" : product._id }, {price_history: JSON.stringify(price_history),"current_price":current_price}, function (err, product) {
                        });
                    }
                    
                    item_types=info.item_types;
                    ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
                        var all={};
                        
                        if (productItemType === null){
                            for(key in item_types){
                                all[key]=[{ date: today, price: item_types[key]['price'], quantity: item_types[key]['quantity'] }];
                            }
                            var productData = {
                                product_id: product_id,
                                item_type_history: JSON.stringify(all)
                            };
                            ProductItemType.create(productData, function (error, product) {
                            });
                        } else {
                            var all=JSON.parse(productItemType.item_type_history);
                            for(key in all){
                                var price_histories = all[key];
                                var find = false;
                                for(var i=0; i<price_histories.length;i++) {
                                    if(price_histories[i].date == today) {
                                        price_histories[i].price = item_types[key]['price'];
                                        price_histories[i].quantity = item_types[key]['quantity'];
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find) {
                                    price_histories.push({date: today, price: item_types[key]['price'], quantity: item_types[key]['quantity']});
                                }
                                all[key]=helper.sort_price_history(price_histories);
                            }
                            

                            ProductItemType.findOneAndUpdate({ "_id" : productItemType._id }, {item_type_history: JSON.stringify(all)}, function (err, product) {
                            });
                        }
                    });
                });
            }
        });

        var obj = {success: true};
        return res.send(JSON.stringify(obj));
            
//        requestify=require('requestify');
//        requestify.get(req.body.url).then(function(response) {
//            var content=response.getBody();
//            var url = req.body.url;
//            var id = req.body.id;
//            var domain = req.body.domain;
//            if (domain == 'qoo10') {
//                inventoryList = req.body.content;
//                info = helperGetContent.get_info_from_qoo10(content, inventoryList);
//            } else if (domain == 'lazada') {
//                info = helperGetContent.get_info_from_lazada(req.body.content);
//            } else if (domain == 'shopee') {
//                temp='<div class="shopee-product-info__header__main-section"><div class="shopee-product-info__header__badges"></div><div class="shopee-product-info__header__title"><h1 class="shopee-product-info__header__text" itemprop="name">Star Wars Sound Effect Tee</h1></div><div class="shopee-product-info__header__price"><div class="shopee-product-info__header__real-price"><link href="http://schema.org/InStock"><!-- react-text: 449 -->$15.00<!-- /react-text --></div></div><!-- react-empty: 450 --><!-- react-empty: 451 --><div class="shopee-product-info__header__rating-soldcount-wrapper"><div class="shopee-product-info__header__rating"><div class="shopee-rating-stars"><div class="shopee-rating-stars__stars"><div class="shopee-rating-stars__star-wrapper"><div class="shopee-rating-stars__lit" style="width: 100%;"><svg class="shopee-svg-icon icon-rating-solid shopee-rating-stars__primary-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><svg class="shopee-svg-icon icon-rating shopee-rating-stars__hollow-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon fill="none" points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><div class="shopee-rating-stars__star-wrapper"><div class="shopee-rating-stars__lit" style="width: 100%;"><svg class="shopee-svg-icon icon-rating-solid shopee-rating-stars__primary-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><svg class="shopee-svg-icon icon-rating shopee-rating-stars__hollow-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon fill="none" points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><div class="shopee-rating-stars__star-wrapper"><div class="shopee-rating-stars__lit" style="width: 100%;"><svg class="shopee-svg-icon icon-rating-solid shopee-rating-stars__primary-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><svg class="shopee-svg-icon icon-rating shopee-rating-stars__hollow-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon fill="none" points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><div class="shopee-rating-stars__star-wrapper"><div class="shopee-rating-stars__lit" style="width: 100%;"><svg class="shopee-svg-icon icon-rating-solid shopee-rating-stars__primary-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><svg class="shopee-svg-icon icon-rating shopee-rating-stars__hollow-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon fill="none" points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><div class="shopee-rating-stars__star-wrapper"><div class="shopee-rating-stars__lit" style="width: 100%;"><svg class="shopee-svg-icon icon-rating-solid shopee-rating-stars__primary-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div><svg class="shopee-svg-icon icon-rating shopee-rating-stars__hollow-star" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><polygon fill="none" points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></polygon></svg></div></div></div><span class="shopee-product-info__header__rating-desc">5 out of 5</span><span class="shopee-product-info__header__rating-count">(22 ratings)</span></div><div class="shopee-product-info__header__sold-count">16 sold monthly</div><div class="shopee-product-info__header__prefer-wrapper"><div class="shopee-horizontal-badge shopee-preferred-seller-badge shopee-horizontal-badge--no-triangle"><svg class="shopee-svg-icon icon-tick" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><g><path d="m6.5 13.6c-.2 0-.5-.1-.7-.2l-5.5-4.8c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l4.7 4 6.8-9.4c.3-.4.9-.5 1.4-.2.4.3.5 1 .2 1.4l-7.4 10.3c-.2.2-.4.4-.7.4 0 0 0 0-.1 0z"></path></g></svg><!-- react-text: 494 --> <!-- /react-text --><!-- react-text: 495 -->Preferred<!-- /react-text --></div></div></div><div class="shopee-product-info__header-coin-info"><svg class="shopee-svg-icon icon-coin-gold shopee-product-info__header-coin-info-icon" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><defs><linearGradient id="a" gradientTransform="matrix(1 0 0 -1 0 -810.11)" gradientUnits="userSpaceOnUse" x1="2.9694" x2="12.0447" y1="-811.8111" y2="-823.427"><stop offset="0" stop-color="#f6c430"></stop><stop offset=".5281" stop-color="#ffecaa"></stop><stop offset=".6639" stop-color="#fdde82"></stop><stop offset=".9673" stop-color="#f7bc1e"></stop><stop offset="1" stop-color="#f6b813"></stop></linearGradient><linearGradient id="b" gradientTransform="matrix(1 0 0 -1 0 -810.11)" gradientUnits="userSpaceOnUse" x1="7.5" x2="7.5" y1="-810.2517" y2="-824.9919"><stop offset="0" stop-color="#e49b00"></stop><stop offset=".9416" stop-color="#d67b00"></stop><stop offset="1" stop-color="#d57900"></stop></linearGradient><linearGradient id="c" gradientTransform="matrix(1 0 0 -1 0 -810.11)" gradientUnits="userSpaceOnUse" x1="4.0932" x2="10.9068" y1="-813.5499" y2="-821.6702"><stop offset="0" stop-color="#f99d00"></stop><stop offset=".1752" stop-color="#eea10b"></stop><stop offset=".5066" stop-color="#fcd21f"></stop><stop offset=".6657" stop-color="#f2ba10"></stop><stop offset="1" stop-color="#d57900"></stop></linearGradient><linearGradient id="d" gradientUnits="userSpaceOnUse" x1="5.4204" x2="9.7379" y1="5.0428" y2="10.188"><stop offset="0" stop-color="#ffec88"></stop><stop offset=".5003" stop-color="#fdf4cb"></stop><stop offset=".7556" stop-color="#fceba4"></stop><stop offset="1" stop-color="#fae17a"></stop></linearGradient></defs><g><circle cx="7.5" cy="7.5" fill="url(#a)" r="7.4"></circle><path d="m7.5.4c3.9 0 7.1 3.2 7.1 7.1s-3.2 7.1-7.1 7.1-7.1-3.2-7.1-7.1 3.2-7.1 7.1-7.1m0-.3c-4.1 0-7.4 3.3-7.4 7.4s3.3 7.4 7.4 7.4 7.4-3.3 7.4-7.4-3.3-7.4-7.4-7.4z" fill="url(#b)"></path><path d="m14.4 7.7c0-.1 0-.1 0-.2 0-3.8-3.1-6.9-6.9-6.9s-6.9 3.1-6.9 6.9v.2c.1-3.7 3.1-6.7 6.9-6.7s6.8 3 6.9 6.7z" fill="#fff5c9"></path><circle cx="7.5" cy="7.5" fill="url(#c)" r="5.3"></circle><path d="m11.4 4c1.1 1 1.8 2.4 1.8 3.9 0 2.9-2.4 5.3-5.3 5.3-1.6 0-3-.7-3.9-1.8.9.8 2.2 1.4 3.5 1.4 2.9 0 5.3-2.4 5.3-5.3 0-1.4-.5-2.6-1.4-3.5z" fill="#ffeead"></path><path d="m11.4 4c-1-1.1-2.4-1.8-3.9-1.8-2.9 0-5.3 2.4-5.3 5.3 0 1.6.7 3 1.8 3.9-.8-.9-1.4-2.2-1.4-3.5 0-2.9 2.4-5.3 5.3-5.3 1.4 0 2.6.5 3.5 1.4z" fill="#c97201"></path><path d="m6.2 4.8c-.5.4-.6 1.1-.5 1.7.1.5.5 1 1.1 1.3.7.4 2.4.8 2.4 1.7 0 .2-.1.5-.2.6-.3.4-.8.5-1.3.5-.3 0-.7-.1-1-.2s-.6-.3-.9-.5c-.2-.1-.4 0-.5.1-.1.2 0 .4.1.5.5.4 1 .7 1.7.8.6.1 1.3.1 1.8-.2.5-.2.9-.6 1-1.2s-.1-1.2-.5-1.6c-.5-.5-2-1-2.4-1.3-.3-.2-.6-.5-.6-1 .1-.6.5-.9 1.1-.9.5 0 1.1.1 1.6.4.4.3.8-.4.4-.7-1-.6-2.5-.7-3.3 0z" fill="#c67830"></path><path d="m6.1 4.5c-.5.4-.6 1.1-.5 1.7.1.5.5 1 1.1 1.3.7.4 2.4.8 2.4 1.7 0 .2-.1.5-.2.6-.3.4-.8.5-1.3.5-.3 0-.7-.1-1-.2s-.6-.3-.9-.5c-.2-.1-.4 0-.5.1-.1.2 0 .4.1.5.5.4 1 .7 1.7.8.6.1 1.3.1 1.8-.2.5-.2.9-.6 1-1.2s-.2-1.2-.6-1.6c-.5-.5-1.9-1-2.3-1.3-.3-.2-.6-.5-.6-1 .1-.6.5-.9 1.1-.9.5 0 1.1.1 1.6.4.4.3.8-.4.4-.7-1-.6-2.5-.7-3.3 0z" fill="url(#d)"></path></g></svg><div class="shopee-product-info__header-coin-info-text">Buy and earn 15 Shopee Coin</div><div class="shopee-drawer "><svg class="shopee-svg-icon icon-help shopee-product-info__coin-tooltip" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><g><circle cx="7.5" cy="7.5" fill="none" r="6.5" stroke-miterlimit="10"></circle><path d="m5.3 5.3c.1-.3.3-.6.5-.8s.4-.4.7-.5.6-.2 1-.2c.3 0 .6 0 .9.1s.5.2.7.4.4.4.5.7.2.6.2.9c0 .2 0 .4-.1.6s-.1.3-.2.5c-.1.1-.2.2-.3.3-.1.2-.2.3-.4.4-.1.1-.2.2-.3.3s-.2.2-.3.4c-.1.1-.1.2-.2.4s-.1.3-.1.5v.4h-.9v-.5c0-.3.1-.6.2-.8s.2-.4.3-.5c.2-.2.3-.3.5-.5.1-.1.3-.3.4-.4.1-.2.2-.3.3-.5s.1-.4.1-.7c0-.4-.2-.7-.4-.9s-.5-.3-.9-.3c-.3 0-.5 0-.7.1-.1.1-.3.2-.4.4-.1.1-.2.3-.3.5 0 .2-.1.5-.1.7h-.9c0-.3.1-.7.2-1zm2.8 5.1v1.2h-1.2v-1.2z" stroke="none"></path></g></svg><div class="shopee-drawer__contents" style="transition-delay: 0.2s; transform: translate(-50%, 0px); left: 50%;"><div class="shopee-arrow-box__container"><div class="shopee-arrow-box__arrow shopee-arrow-box__arrow--center"><div class="shopee-arrow-box__arrow-outer"><div class="shopee-arrow-box__arrow-inner"></div></div></div><div class="shopee-arrow-box__content"><div class="shopee-product-info__coin-tooltip-content">Earn Shopee Coins to redeem for future purchases. Every 100 Coins earned can be redeemed for $1.</div></div></div></div></div></div></div>';
//                info = helperGetContent.get_info_from_shopee(temp);
//            }
//            
//            
//            
//            var data = {
//                domain: domain,
//                id: id,
//                content: content,
//                item_types: info.item_types
//            };
//            today = helper.get_today();
//            UrlContent.findOne({domain: domain,id:id,createdDate: today}, function (error, urlContent) {
//                if (urlContent === null){
//                    UrlContent.create(data, function (error, urlContent) {
//                    });  
//
//                    var product_id = domain + "_" + id;
//                    Product.findOne({product_id: product_id}, function (error, product) {
//
//                        if (product === null){
//                            var price_histories = [
//                                { date: today, price: info.sell_price, item_types: info.item_types }
//                            ];                    
//                            var productData = {
//                                product_id: product_id,
//                                price_history: JSON.stringify(price_histories),
//                                current_price: info.sell_price
//                            };
//                            Product.create(productData, function (error, product) {
//                            });
//                        } else {
//                            var price_histories = JSON.parse(product.price_history);
//                            var find = false;
//                            for(var i=0; i<price_histories.length;i++) {
//                                if(price_histories[i].date == today) {
//                                    price_histories[i].price = info.sell_price;
//                                    price_histories[i].item_types = info.item_types;
//                                    find = true;
//                                    break;
//                                }
//                            }
//                            if(!find) {
//                                price_histories.push({date: today, price: info.sell_price, item_types: info.item_types});
//                            }
//                            price_history=helper.sort_price_history(price_histories);
//                            current_price=price_history[price_history.length-1].price;
//
//                            helperGetContent.send_mail_for_tracking_price_fixed(product_id,info.sell_price);
//
//                            Product.findOneAndUpdate({ "_id" : product._id }, {price_history: JSON.stringify(price_history),"current_price":current_price}, function (err, product) {
//                            });
//                        }
//                    });
//                }
//            });
//
//            var obj = {success: true};
//            return res.send(JSON.stringify(obj));
//            
//        });
        
        
        
        
        
        
        
    });

    //POST route for updating data
    app.post('/login', function (req, res) {
        var err = '';
        

        if (req.body.logemail && req.body.logpassword) {
            // login
            User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
                if (error || !user) {
                    if(req.body.is_ajax) {
                        var obj = {success:false,message:"Wrong email or password."};
                        return res.send(JSON.stringify(obj));
                    } else {
                        return res.send("Wrong email or password.");
                    }
                } else {
                    req.session.userId = user._id;
                    req.session.userEmail = req.body.logemail;
                    req.session.is24x7 = user.is24x7;
                    if(req.body.rememberme) {
                        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
                    } else {
                        req.session.cookie.expires = false; // Cookie expires at end of session
                    }
                    if(req.body.is_ajax) {
                        var obj = {success:true};
                        TrackingPrice.findOne({product_id: req.body.product_id,user_id:req.session.userId}, function (error, trackingPrice) {
                            if (error) { obj.tracked_price = 0; } else {
                                if (trackingPrice === null) { obj.tracked_price = 0; } else {
                                    obj.tracked_price = trackingPrice.tracked_price;
                                }
                            }
                            res.send(JSON.stringify(obj));
                        });
                        
                    } else {
                        return res.redirect('/');
                    }
                }
            });
        } else {
            if(req.body.is_ajax) {
                var obj = {success:false,message:'All fields required.'};
                res.send(JSON.stringify(obj));
            } else {
                res.send('All fields required.');
            }
        }
    });
    
    app.post('/register', function (req, res) {
        var err = '';
        // confirm that user typed same password twice
        if (req.body.password !== req.body.passwordConf) {
            if(req.body.is_ajax) {
                var obj = {success:false,message:"Passwords do not match."};
                return res.send(JSON.stringify(obj));
            } else {
                return res.send("Passwords do not match");
            }
        }

        if (req.body.email &&
            req.body.username &&
            req.body.password &&
            req.body.passwordConf) {
            // register
            var userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            };
            User.findOne({email: req.body.email}, function (error, user) {
                if (error) {
                    if(req.body.is_ajax) {
                        var obj = {success:false,message:"Can not create user"};
                        return res.send(JSON.stringify(obj));
                    } else {
                        return res.send("Can not create user");
                    }
                } else {
                    if (user === null) {
                        User.findOne({username: req.body.username}, function (error, user) {
                            if (error) {
                                if (req.body.is_ajax) {
                                    var obj = {success:false,message:"Can not create user"};
                                    return res.send(JSON.stringify(obj));
                                } else {
                                    return res.send("Can not create user");
                                }
                            } else {
                                if (user === null) {
                                    User.create(userData, function (error, user) {
                                        
                                        if (error) {
                                            if (req.body.is_ajax) {
                                                var obj = {success: false, message: "Can not create user"};
                                                return res.send(JSON.stringify(obj));
                                            } else {
                                                return res.send("Can not create user");
                                            }
                                        } else {
                                            if (req.body.is_ajax) {
                                                var obj = {success: true,tracked_price: 0};
                                                req.session.userId = user._id;
                                                req.session.userEmail = req.body.email;
                                                req.session.is24x7 = user.is24x7;
                                                return res.send(JSON.stringify(obj));
                                            } else {
                                                req.session.userId = user._id;
                                                return res.redirect('/');
                                            }
                                        }
                                    });
                                } else {
                                    if (req.body.is_ajax) {
                                        var obj = {success: false, message: "Username was existed"};
                                        res.send(JSON.stringify(obj));
                                    } else {
                                        return res.send("Username was existed.");
                                    }
                                }
                            }
                        });
                    } else {
                        if (req.body.is_ajax) {
                            var obj = {success: false, message: "Email was existed"};
                            res.send(JSON.stringify(obj));
                        } else {
                            return res.send("Email was existed.");
                        }
                    }
                }
            });
        }  else {
            if(req.body.is_ajax) {
                var obj = {success:false,message:'All fields required.'};
                res.send(JSON.stringify(obj));
            } else {
                res.send('All fields required.');
            }
        }
    });
    // GET for logout
    app.get('/logout/:domain/:id', function (req, res, next) {
        var domain = req.params.domain;
        var id = req.params.id;
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) {
                    res.send('Something went wrong');
                } else {
                    return res.redirect('/banana/'+domain+'/'+id);
                }
            });
        }
    });
}