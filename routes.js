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
    
    app.get('/get/:domain/:id/:text', function (req, res) {
        var domain = req.params.domain;        
        var id = req.params.id;
        var product_id = domain+'_'+id;
        var text = req.params.text;
        var to_day = new Date();
        var from_day = new Date(helper.get_today());
        if (text=='1w'){
            from_day.setDate(from_day.getDate() - 7);
        }
        else if (text=='1m'){
            from_day.setDate(from_day.getDate() - 31);
        }
        else if (text=='3m'){
            from_day.setDate(from_day.getDate() - 93);
        }
        else if (text=='6m'){
            from_day.setDate(from_day.getDate() - 186);
        }
        else if (text=='YTD'){
            from_day=new Date(new Date().getFullYear(), 0, 1);
        }
        else if (text=='1y'){
            from_day.setDate(from_day.getDate() - 365);
        }
        else if (text=='All'){
            from_day=null;
        }
        
        
        Product.findOne({product_id: product_id}, function (error, product) {  
            var price_histories = JSON.parse(product.price_history);
            price_history=helper.build_price_history(price_histories);
            var data_price=[];
            temp=price_history.split('_');
            for(i=0;i<temp.length;i++){
                if(temp[i]!=''){
                    date_and_price=temp[i].split('-');
                    date=parseInt(date_and_price[0]);
                    price=parseFloat(date_and_price[1]);
                    if (from_day == null || date >= from_day.getTime()) {
                        data_price.push([date, price]);
                    }
                    
                }

            }
            return res.send(JSON.stringify(data_price));
        });
        
    });
    app.get('/tracked', function (req, res) {
        names=[];
        current_prices=[];
        tracked_prices=[];
        sites=[];
        if (req.session.hasOwnProperty("userId")) {
//            TrackingPrice.find({user_id:req.session.userId}, function (error, trackingPrices) {
//                console.log(trackingPrices);
//                return res.render('tracked', {
//                                    name: '',
//                                });
//            })

                var MongoClient = require('mongodb').MongoClient;
                var url = "mongodb://localhost/pricebanana";

                MongoClient.connect(url, function(err, db) {
                  if (err) throw err;
                  db.collection('trackingprices').aggregate([
                      { $match: { user_id: req.session.userId } },
                    { $lookup:
                       {
                         from: 'products',
                         localField: 'product_id',
                         foreignField: 'product_id',
                         as: 'products'
                       }
                     }
                    ], function(err, trackingprices) {
                    if (err) throw err;
                    for(i=0;i<trackingprices.length;i++){
                        tracked_prices.push(trackingprices[i].tracked_price);
                        names.push(trackingprices[i].products[0].name);
                        current_prices.push(trackingprices[i].products[0].current_price);
                        site=trackingprices[i].product_id.split('_');
                        sites.push(site[0]);
                    }
                    db.close();
                    return res.render('tracked', {
                        tracked_prices: JSON.stringify(tracked_prices),
                        current_prices: JSON.stringify(current_prices),
                        names: JSON.stringify(names),
                        sites: JSON.stringify(sites)
                    });
                    
                  });
                });
        }
        else{
            return res.redirect('/account');
        }
        
        
    });
    
    app.get('/account', function (req, res) {
        if(req.session.hasOwnProperty("userId")){
            return res.redirect('/tracked');
        }
        else{
            return res.render('account', {
            });
        }
        
    });

    app.get('/banana/:domain/:id', function (req, res) {

        var domain = req.params.domain;        
        var id = req.params.id;
        var path_for_view='banana';
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

        var from_day = new Date(helper.get_today());
        from_day.setDate(from_day.getDate() - config.range_date_default);
        
        if (domain == 'tokopedia') {
            render_file = path_for_view+'/banana_tokopedia';
        }
        else if (domain == 'qoo10') {
            render_file = path_for_view+'/banana_qoo10';
        }
        else if (domain == 'lazada') {
            render_file = path_for_view+'/banana_lazada';
        }
        else {
            render_file = path_for_view+'/banana_shopee';
        } 
        
        if (req.session.hasOwnProperty("is24x7") && req.session.is24x7=='1') {
            var is_admin = '1';
        } else {
            var is_admin = '0';
        }
        
        Product.findOne({product_id: product_id}, function (error, product) {  
            if (product === null) {
                var item_types = {};
                return res.render(render_file, {
                                name: '',
                                price_history:[],
                                user_email: user_email,
                                current_price: 0,
                                tracked_price: 0,
                                isLogin: req.session.hasOwnProperty("userId"),
                                item_type_history: item_types,
                                item_type_labels:null,
                                is_admin:is_admin,
                                see_history:helper.build_see_history(see_histories),
                                sold_history:helper.build_sold_history(sold_histories),
                                rating_history:helper.build_rating_history(rating_histories),
                                booking_min_history:helper.build_booking_min_history(booking_min_histories),
                                reviews_history:helper.build_reviews_history(reviews_histories),
                                discussion_history:helper.build_discussion_history(discussion_histories),
                                seller_name:'',
                                seller_url:'',
                                transaction_success:'',
                                item_sold:'',
                                talk_response_rate:'',
                                talk_response_time:'',
                                message_response_rate:'',
                                message_response_time:'',
                                shipment_support:'',
                                location_of_shop:'',
                                condition:'',
                                insurance:'',
                                weight:'',
                                current_review_count:'',
                                current_rating_count:'',
                                current_number_of_talk_about:'',
                                last_updated_price:'',
                                product_category:''
                            });
            }
            else{
                
                var price_histories = JSON.parse(product.price_history);
                
                temp = helper.build_price_history(price_histories);
                
//                var data_price = [];
//                temp = temp.split('_');
//                for (i = 0; i < temp.length; i++) {
//                    if (temp[i] != '') {
//                        date_and_price = temp[i].split('-');
//                        date = parseInt(date_and_price[0]);
//                        price = parseFloat(date_and_price[1]);
//                        if (from_day == null || (date >= from_day.getTime())) {
//                            data_price.push({date: price_histories[i].date, price: price});
//                        }
//
//                    }
//
//                }
//                price_histories = data_price;
                
                if (domain == 'tokopedia') {
                    var see_histories = JSON.parse(product.see_history);
                    var sold_histories = JSON.parse(product.sold_history);
                    var rating_histories = JSON.parse(product.rating_history);
                    var booking_min_histories = JSON.parse(product.booking_min_history);
                    var reviews_histories = JSON.parse(product.reviews_history);
                    var discussion_histories = JSON.parse(product.discussion_history);
                }
                else{
                    var see_histories = null;
                    var sold_histories = null;
                    var rating_histories = null;
                    var booking_min_histories = null;
                    var reviews_histories = null;
                    var discussion_histories = null;
                }
                
                var current_price = product.current_price;
                var tracked_price = '';
                
                TrackingPrice.findOne({product_id: product_id,user_id:req.session.userId}, function (error, trackingPrice) {
                        if (trackingPrice === null) {
                            ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
                                return res.render(render_file, {
                                    name:product.name,
                                    price_history:helper.build_price_history(price_histories),
                                    user_email: user_email,
                                    current_price: current_price,
                                    tracked_price: tracked_price,
                                    isLogin: req.session.hasOwnProperty("userId"),
                                    item_type_history: productItemType.item_type_history,
                                    item_type_labels:product.item_type_labels,
                                    is_admin:is_admin,
                                    see_history:helper.build_see_history(see_histories),
                                    sold_history:helper.build_sold_history(sold_histories),
                                    rating_history:helper.build_rating_history(rating_histories),
                                    booking_min_history:helper.build_booking_min_history(booking_min_histories),
                                    reviews_history:helper.build_reviews_history(reviews_histories),
                                    discussion_history:helper.build_discussion_history(discussion_histories),
                                    seller_name:(product.seller_name==undefined?'':product.seller_name),
                                    seller_url:(product.seller_url==undefined?'':product.seller_url),
                                    transaction_success:(product.transaction_success==undefined?'':product.transaction_success),
                                    item_sold:(product.item_sold==undefined?'':product.item_sold),
                                    talk_response_rate:(product.talk_response_rate==undefined?'':product.talk_response_rate),
                                    talk_response_time:(product.talk_response_time==undefined?'':product.talk_response_time),
                                    message_response_rate:(product.message_response_rate==undefined?'':product.message_response_rate),
                                    message_response_time:(product.message_response_time==undefined?'':product.message_response_time),
                                    shipment_support:(product.shipment_support==undefined?'':product.shipment_support),
                                    location_of_shop:(product.location_of_shop==undefined?'':product.location_of_shop),
                                    condition:(product.condition==undefined?'':product.condition),
                                    insurance:(product.insurance==undefined?'':product.insurance),
                                    weight:(product.weight==undefined?'':product.weight),
                                    current_review_count:(product.current_review_count==undefined?'':product.current_review_count),
                                    current_rating_count:(product.current_rating_count==undefined?'':product.current_rating_count),
                                    current_number_of_talk_about:(product.current_number_of_talk_about==undefined?'':product.current_number_of_talk_about),
                                    last_updated_price:(product.last_updated_price==undefined?'':product.last_updated_price),
                                    product_category:(product.product_category==undefined?'':product.product_category)
                                });

                            });
                            
                        } else {
                            
                            ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
                                tracked_price = trackingPrice.tracked_price;
                                return res.render(render_file, {
                                    name:product.name,
                                    price_history:helper.build_price_history(price_histories),
                                    user_email: user_email,
                                    current_price: current_price,
                                    tracked_price: tracked_price,
                                    isLogin: req.session.hasOwnProperty("userId"),
                                    item_type_history: productItemType.item_type_history,
                                    item_type_labels:product.item_type_labels,
                                    is_admin:is_admin,
                                    see_history:helper.build_see_history(see_histories),
                                    sold_history:helper.build_sold_history(sold_histories),
                                    rating_history:helper.build_rating_history(rating_histories),
                                    booking_min_history:helper.build_booking_min_history(booking_min_histories),
                                    reviews_history:helper.build_reviews_history(reviews_histories),
                                    discussion_history:helper.build_discussion_history(discussion_histories),
                                    seller_name:(product.seller_name==undefined?'':product.seller_name),
                                    seller_url:(product.seller_url==undefined?'':product.seller_url),
                                    transaction_success:(product.transaction_success==undefined?'':product.transaction_success),
                                    item_sold:(product.item_sold==undefined?'':product.item_sold),
                                    talk_response_rate:(product.talk_response_rate==undefined?'':product.talk_response_rate),
                                    talk_response_time:(product.talk_response_time==undefined?'':product.talk_response_time),
                                    message_response_rate:(product.message_response_rate==undefined?'':product.message_response_rate),
                                    message_response_time:(product.message_response_time==undefined?'':product.message_response_time),
                                    shipment_support:(product.shipment_support==undefined?'':product.shipment_support),
                                    location_of_shop:(product.location_of_shop==undefined?'':product.location_of_shop),
                                    condition:(product.condition==undefined?'':product.condition),
                                    insurance:(product.insurance==undefined?'':product.insurance),
                                    weight:(product.weight==undefined?'':product.weight),
                                    current_review_count:(product.current_review_count==undefined?'':product.current_review_count),
                                    current_rating_count:(product.current_rating_count==undefined?'':product.current_rating_count),
                                    current_number_of_talk_about:(product.current_number_of_talk_about==undefined?'':product.current_number_of_talk_about),
                                    last_updated_price:(product.last_updated_price==undefined?'':product.last_updated_price),
                                    product_category:(product.product_category==undefined?'':product.product_category)
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
        var see = req.body.see;
        if (id != undefined && id != 'undefined') {
            if (domain == 'qoo10') {
                info = helperGetContent.get_info_from_qoo10(req.body.content, req.body.inventoryList);
            } else if (domain == 'lazada') {
                info = helperGetContent.get_info_from_lazada(req.body.content);
            } else if (domain == 'shopee') {
                info = helperGetContent.get_info_from_shopee(req.body.content);
            } else if (domain == 'tokopedia') {
                info = helperGetContent.get_info_from_tokopedia(req.body.content);
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
                            if (domain == 'tokopedia') {
                                
                                var see_histories = [
                                    { date: today, see: see}
                                ]; 
                                var rating_histories = [
                                    { date: today, rating: info.rating}
                                ]; 
                                var sold_histories = [
                                    { date: today, sold: info.sold}
                                ]; 
                                var booking_min_histories = [
                                    { date: today, booking_min: info.booking_min}
                                ]; 
                                var reviews_histories = [
                                    { date: today, reviews: info.reviews}
                                ]; 
                                var discussion_histories = [
                                    { date: today, discussion: info.discussion}
                                ]; 
                            }
                            var productData = {
                                product_id: product_id,
                                price_history: JSON.stringify(price_histories),
                                current_price: info.sell_price,
                                name: info.name,
                                item_type_labels: info.item_type_labels
                            };
                            if (domain == 'tokopedia') {
                                productData['see_history'] = JSON.stringify(see_histories);
                                productData['rating_history'] = JSON.stringify(rating_histories);
                                productData['sold_history'] = JSON.stringify(sold_histories);
                                productData['booking_min_history'] = JSON.stringify(booking_min_histories);
                                productData['reviews_history'] = JSON.stringify(reviews_histories);
                                productData['discussion_history'] = JSON.stringify(discussion_histories);
                                productData['seller_name']=info.seller_name;
                                productData['seller_url']=info.seller_url;
                                productData['transaction_success']=info.transaction_success;
                                productData['item_sold']=info.item_sold;
                                productData['talk_response_rate']=info.talk_response_rate;
                                productData['talk_response_time']=info.talk_response_time;
                                productData['message_response_rate']=info.message_response_rate;
                                productData['message_response_time']=info.message_response_time;
                                productData['shipment_support']=info.shipment_support;
                                productData['location_of_shop']=info.location_of_shop;
                                productData['condition']=info.condition;
                                productData['insurance']=info.insurance;
                                productData['weight']=info.weight;
                                productData['current_review_count']=info.current_review_count;
                                productData['current_rating_count']=info.current_rating_count;
                                productData['current_number_of_talk_about']=info.current_number_of_talk_about;
                                productData['last_updated_price']=info.last_updated_price;
                                productData['product_category']=info.product_category;
                            }
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
                            
                            if (domain == 'tokopedia') {
                                
                                var see_histories = JSON.parse(product.see_history);
                                var rating_histories = JSON.parse(product.rating_history);
                                var sold_histories = JSON.parse(product.sold_history);
                                var booking_min_histories = JSON.parse(product.booking_min_history);
                                var reviews_histories = JSON.parse(product.reviews_history);
                                var discussion_histories = JSON.parse(product.discussion_history);
                                
                                find = false;
                                for(var i=0; i<see_histories.length;i++) {
                                    if(see_histories[i].date == today) {
                                        see_histories[i].price = see;
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find) {
                                    see_histories.push({date: today, see: see});
                                }
                                see_history=helper.sort_price_history(see_histories);
                                
                                find = false;
                                for(var i=0; i<rating_histories.length;i++) {
                                    if(rating_histories[i].date == today) {
                                        rating_histories[i].price = info.rating;
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find) {
                                    rating_histories.push({date: today, rating: info.rating});
                                }
                                rating_history=helper.sort_price_history(rating_histories);
                                
                                find = false;
                                for(var i=0; i<sold_histories.length;i++) {
                                    if(sold_histories[i].date == today) {
                                        sold_histories[i].price = info.sold;
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find) {
                                    sold_histories.push({date: today, sold: info.sold});
                                }
                                sold_history=helper.sort_price_history(sold_histories);
                                
                                find = false;
                                for(var i=0; i<booking_min_histories.length;i++) {
                                    if(booking_min_histories[i].date == today) {
                                        booking_min_histories[i].price = info.booking_min;
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find) {
                                    booking_min_histories.push({date: today, booking_min: info.booking_min});
                                }
                                booking_min_history=helper.sort_price_history(booking_min_histories);
                                
                                find = false;
                                for(var i=0; i<reviews_histories.length;i++) {
                                    if(reviews_histories[i].date == today) {
                                        reviews_histories[i].price = info.reviews;
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find) {
                                    reviews_histories.push({date: today, reviews: info.reviews});
                                }
                                reviews_history=helper.sort_price_history(reviews_histories);
                                
                                find = false;
                                for(var i=0; i<discussion_histories.length;i++) {
                                    if(discussion_histories[i].date == today) {
                                        discussion_histories[i].price = info.discussion;
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find) {
                                    discussion_histories.push({date: today, discussion: info.discussion});
                                }
                                discussion_history=helper.sort_price_history(discussion_histories);
                            }

                            helperGetContent.send_mail_for_tracking_price_fixed(product_id,info.sell_price);

                            if (domain == 'tokopedia') {
                                Product.findOneAndUpdate({ "_id" : product._id }, {reviews_history: JSON.stringify(reviews_history),discussion_history: JSON.stringify(discussion_history),price_history: JSON.stringify(price_history),see_history: JSON.stringify(see_history),rating_history: JSON.stringify(rating_history),sold_history: JSON.stringify(sold_history),booking_min_history: JSON.stringify(booking_min_history),"current_price":current_price}, function (err, product) {
                                });
                            }
                            else{
                                Product.findOneAndUpdate({ "_id" : product._id }, {price_history: JSON.stringify(price_history),"current_price":current_price}, function (err, product) {
                                });
                            }
                            
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
        }
        else{
            var obj = {success: false};
            return res.send(JSON.stringify(obj));
        }
        
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
            req.body.password &&
            req.body.passwordConf) {
            // register
            var userData = {
                email: req.body.email,
                password: req.body.password
            };
            User.findOne({email: req.body.email}, function (error, user) {
                if (user === null) {
                    User.create(userData, function (error, user) {
                        if (req.body.is_ajax) {
                            var obj = {success: true,tracked_price: 0};
                            req.session.userId = user._id;
                            req.session.userEmail = req.body.email;
                            req.session.is24x7 = user.is24x7;
                            return res.send(JSON.stringify(obj));
                            
                        } else {
                            req.session.userId = user._id;
                            req.session.userEmail = req.body.email;
                            req.session.is24x7 = user.is24x7;
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