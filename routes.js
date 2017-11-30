var User = require(__dirname + '/models/user');
var Product = require(__dirname + '/models/product');
var TrackingPrice = require(__dirname + '/models/tracking_price');
var UrlContent = require(__dirname + '/models/url_content');
var helper = require(__dirname + '/helpers/functions');
var helperGetContent = require(__dirname + '/helpers/get_content');
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
        Product.findOne({product_id: product_id}, function (error, product) {  
            if (error || product === null) {
                return res.render('banana', {
                                price_history:[],
                                user_email: user_email,
                                current_price: 0,
                                tracked_price: 0,
                                isLogin: req.session.hasOwnProperty("userId"),
                                label_for_action_tracking: 'Start tracking'
                            });
            }
            else{
                var price_histories = JSON.parse(product.price_history);
                var current_price = product.current_price;
                var tracked_price = current_price;
                TrackingPrice.findOne({product_id: product_id,user_id:req.session.userId}, function (error, trackingPrice) {
                        if (error) {} else {
                            if (trackingPrice === null) {
                                return res.render('banana', {
                                    price_history:helper.build_price_history(price_histories),
                                    user_email: user_email,
                                    current_price: current_price,
                                    tracked_price: tracked_price,
                                    isLogin: req.session.hasOwnProperty("userId"),
                                    label_for_action_tracking: 'Start tracking'
                                });
                            } else {
                                tracked_price = trackingPrice.tracked_price;
                                return res.render('banana', {
                                    price_history:helper.build_price_history(price_histories),
                                    user_email: user_email,
                                    current_price: current_price,
                                    tracked_price: tracked_price,
                                    isLogin: req.session.hasOwnProperty("userId"),
                                    label_for_action_tracking: 'Update tracking'
                                });
                            }
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
     
        var url = req.body.url;
        var content = req.body.content;
        var data = {
            url: url,
            content: content
        };

        arr = helperGetContent.get_domain_and_id_from_url(url);
        domain = arr.domain;
        id = arr.id;
        
        UrlContent.create(data, function (error, urlContent) {
            if (error) {
                if (error.code == '11000') { 
                } else {
                    var obj = {success: false};
                    return res.send(JSON.stringify(obj));
                }
                
            } 
        });
        
        var product_id = domain + "_" + id;
        Product.findOne({product_id: product_id}, function (error, product) {
            if (error) {
                var obj = {success:false};
                return res.send(JSON.stringify(obj));
            } else {
                price_date = helper.get_today();
                if (product === null) {
                    info = helperGetContent.get_info_from_html(content);
                    var price_histories = [
                        { date: price_date, price: info.sell_price }
                    ];                    
                    var productData = {
                        product_id: product_id,
                        price_history: JSON.stringify(price_histories),
                        current_price: info.sell_price
                    };
                    Product.create(productData, function (error, product) {
                        if (error) {
                            var obj = {success:false};
                            return res.send(JSON.stringify(obj));
                        } else {
//                            productId = product._id;
                        }
                    });
                } else {
                    
                    info = helperGetContent.get_info_from_html(content);
                    var price_histories = JSON.parse(product.price_history);
                    var find = false;
                    for(var i=0; i<price_histories.length;i++) {
                        if(price_histories[i].date == price_date) {
                            price_histories[i].price = info.sell_price;
                            find = true;
                            break;
                        }
                    }
                    if(!find) {
                        price_histories.push({date: price_date, price: info.sell_price});
                    }
                    price_history=helper.sort_price_history(price_histories);
                    current_price=price_history[price_history.length-1].price;
                    
                    helperGetContent.send_mail_for_tracking_price_fixed(product_id,info.sell_price);
                    
                    Product.findOneAndUpdate({ "_id" : product._id }, {price_history: JSON.stringify(price_history),"current_price":current_price}, function (err, product) {
                        if (error) {
                            var obj = {success:false};
                            return res.send(JSON.stringify(obj));
                        } 
                    });
                }
            }
        });
        
        var obj = {success: true};
        return res.send(JSON.stringify(obj));
        
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
                password: req.body.password,
                passwordConf: req.body.passwordConf
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